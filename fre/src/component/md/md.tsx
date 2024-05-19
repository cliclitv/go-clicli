import { marked } from "marked";
import './md.css'

export default function Markdown({ text }: any) {
    var renderer = new marked.Renderer();
    renderer.link = function (href, title, text) {
        var link = marked.Renderer.prototype.link.call(this, href, title, text);
        return link.replace("<a", "<a target='_blank' ");
    };
    return <article className="artice" dangerouslySetInnerHTML={{ __html: marked.parse(text, { renderer }) }}></article>
}