const fs = require('fs');
const path = require('path');
const marked = require('marked');
const Mustache = require('mustache');

const srcDir = './src';
const publicDir = './public';

const templates = {
    layout: fs.readFileSync(path.join(srcDir, 'templates', 'layout.html'), 'utf-8'),
    header: fs.readFileSync(path.join(srcDir, 'templates', 'header.html'), 'utf-8'),
    footer: fs.readFileSync(path.join(srcDir, 'templates', 'footer.html'), 'utf-8'),
};

function buildPage(contentFile) {
    const contentMarkdown = fs.readFileSync(path.join(srcDir, 'content', contentFile), 'utf-8');
    const contentHtml = marked(contentMarkdown);
    const frontMatterMatch = contentMarkdown.match(/---\n([\s\S]+?)\n---/);
    const frontMatter = frontMatterMatch ? frontMatterMatch[1] : '';
    const titleMatch = frontMatter.match(/title:\s*(.+)/);
    const title = titleMatch ? titleMatch[1] : 'No Title';

    const html = Mustache.render(templates.layout, {
        title,
        content: contentHtml,
    }, {
        header: templates.header,
        footer: templates.footer,
    });

    const outputFileName = contentFile.replace('.md', '.html');
    fs.writeFileSync(path.join(publicDir, outputFileName), html);
}

fs.readdirSync(path.join(srcDir, 'content')).forEach(buildPage);

console.log('Site built successfully!');
