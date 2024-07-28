import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';
import { render } from 'mustache';

const srcDir = './src';
const publicDir = './public';

const templates = {
    layout: readFileSync(join(srcDir, 'templates', 'layout.html'), 'utf-8'),
    header: readFileSync(join(srcDir, 'templates', 'header.html'), 'utf-8'),
    footer: readFileSync(join(srcDir, 'templates', 'footer.html'), 'utf-8'),
};

function buildPage(contentFile) {
    const contentMarkdown = readFileSync(join(srcDir, 'content', contentFile), 'utf-8');
    const contentHtml = marked.parse(contentMarkdown);
    const frontMatterMatch = contentMarkdown.match(/---\n([\s\S]+?)\n---/);
    const frontMatter = frontMatterMatch ? frontMatterMatch[1] : '';
    const titleMatch = frontMatter.match(/title:\s*(.+)/);
    const title = titleMatch ? titleMatch[1] : 'No Title';

    const html = render(templates.layout, {
        title,
        content: contentHtml,
    }, {
        header: templates.header,
        footer: templates.footer,
    });

    const outputFileName = contentFile.replace('.md', '.html');
    writeFileSync(join(publicDir, outputFileName), html);
}

readdirSync(join(srcDir, 'content')).forEach(buildPage);

console.log('Site built successfully!');
