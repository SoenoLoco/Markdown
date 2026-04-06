// parser.js
export function parseMarkdown(md) {
  let html = md;

  // 1. Блоки кода (``` ... ```) — обрабатываем ДО всего остального
  html = html.replace(/```(\w*)?\n([\s\S]*?)```/gm, function (_, lang, code) {
    const cls = lang ? ` class="language-${lang}"` : "";
    return `<pre><code${cls}>${escapeHtml(code.trim())}</code></pre>`;
  });

  // 2. Горизонтальная линия
  html = html.replace(/^---$/gm, "<hr>");

  // 3. Заголовки
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  
  // 4. Жирный и курсив
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // 5. Инлайн-код
  html = html.replace(/`(.+?)`/g, "<code>$1</code>");

  // 6. Ссылки [текст](url)
  html = html.replace(
    /\[(.+?)\]\((.+?)\)/g,
    '<a href="$2" target="_blank">$1</a>',
  );

  // 7. Списки (строки, начинающиеся с '- ')
  html = html.replace(/((?:^- .+\n?)+)/gm, function (block) {
    const items = block
      .trim()
      .split("\n")
      .map(function (line) {
        return "<li>" + line.replace(/^- /, "") + "</li>";
      })
      .join("");
    return "<ul>" + items + "</ul>";
  });

  // 8. Параграфы (двойной перенос строки)
  html = html.replace(/^(?!<[hup]).+$/gm, function (line) {
    if (line.trim() === "") return "";
    return "<p>" + line + "</p>";
  });
  return html;
}

// Экранирование спецсимволов HTML внутри блоков кода
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
