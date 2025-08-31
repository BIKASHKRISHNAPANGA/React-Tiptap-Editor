import { useCallback, useState } from "react";
import RichTextEditor, { BaseKit } from "reactjs-tiptap-editor";

import {
  BubbleMenuTwitter,
  BubbleMenuKatex,
  BubbleMenuExcalidraw,
  BubbleMenuMermaid,
  BubbleMenuDrawer,
} from "reactjs-tiptap-editor/bubble-extra";
import { Trash2, Upload } from "lucide-react";
import { Attachment } from "reactjs-tiptap-editor/attachment";
import { Blockquote } from "reactjs-tiptap-editor/blockquote";
import { Bold } from "reactjs-tiptap-editor/bold";
import { BulletList } from "reactjs-tiptap-editor/bulletlist";
import { Clear } from "reactjs-tiptap-editor/clear";
import { Code } from "reactjs-tiptap-editor/code";
import { CodeBlock } from "reactjs-tiptap-editor/codeblock";
import { Color } from "reactjs-tiptap-editor/color";
import { ColumnActionButton } from "reactjs-tiptap-editor/multicolumn";
import { Emoji } from "reactjs-tiptap-editor/emoji";
import { ExportPdf } from "reactjs-tiptap-editor/exportpdf";
import { ExportWord } from "reactjs-tiptap-editor/exportword";
import { FontFamily } from "reactjs-tiptap-editor/fontfamily";
import { FontSize } from "reactjs-tiptap-editor/fontsize";
import { FormatPainter } from "reactjs-tiptap-editor/formatpainter";
import { Heading } from "reactjs-tiptap-editor/heading";
import { Highlight } from "reactjs-tiptap-editor/highlight";
import { History } from "reactjs-tiptap-editor/history";
import { HorizontalRule } from "reactjs-tiptap-editor/horizontalrule";
import { Iframe } from "reactjs-tiptap-editor/iframe";
import { Image } from "reactjs-tiptap-editor/image";
import { ImageGif } from "reactjs-tiptap-editor/imagegif";
import { ImportWord } from "reactjs-tiptap-editor/importword";
import { Indent } from "reactjs-tiptap-editor/indent";
import { Italic } from "reactjs-tiptap-editor/italic";
import { LineHeight } from "reactjs-tiptap-editor/lineheight";
import { Link } from "reactjs-tiptap-editor/link";
import { Mention } from "reactjs-tiptap-editor/mention";
import { MoreMark } from "reactjs-tiptap-editor/moremark";
import { OrderedList } from "reactjs-tiptap-editor/orderedlist";
import { SearchAndReplace } from "reactjs-tiptap-editor/searchandreplace";
import { SlashCommand } from "reactjs-tiptap-editor/slashcommand";
import { Strike } from "reactjs-tiptap-editor/strike";
import { Table } from "reactjs-tiptap-editor/table";
import { TableOfContents } from "reactjs-tiptap-editor/tableofcontent";
import { TaskList } from "reactjs-tiptap-editor/tasklist";
import { TextAlign } from "reactjs-tiptap-editor/textalign";
import { TextUnderline } from "reactjs-tiptap-editor/textunderline";
import { Video } from "reactjs-tiptap-editor/video";
import { TextDirection } from "reactjs-tiptap-editor/textdirection";
import { Katex } from "reactjs-tiptap-editor/katex";
import { Drawer } from "reactjs-tiptap-editor/drawer";
import { Excalidraw } from "reactjs-tiptap-editor/excalidraw";
import { Twitter } from "reactjs-tiptap-editor/twitter";
import { Mermaid } from "reactjs-tiptap-editor/mermaid";


import "reactjs-tiptap-editor/style.css";
import "prism-code-editor-lightweight/layout.css";
import "prism-code-editor-lightweight/themes/github-dark.css";
import "katex/dist/katex.min.css";
import "easydrawer/styles.css";
import "@excalidraw/excalidraw/index.css";

function convertBase64ToBlob(base64: string) {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

const DEFAULT = `<h1>Start Writing...</h1><p>Your awesome content here!</p>`;

const extensions = [
  BaseKit.configure({
    placeholder: { showOnlyCurrent: true },
    characterCount: { limit: 50000 },
  }),
  History,
  SearchAndReplace,
  TableOfContents,
  FormatPainter.configure({ spacer: true }),
  Clear,
  FontFamily,
  Heading.configure({ spacer: true }),
  FontSize,
  Bold,
  Italic,
  TextUnderline,
  Strike,
  MoreMark,
  Emoji,
  Color.configure({ spacer: true }),
  Highlight,
  BulletList,
  OrderedList,
  TextAlign.configure({ types: ["heading", "paragraph"], spacer: true }),
  Indent,
  LineHeight,
  TaskList.configure({ spacer: true, taskItem: { nested: true } }),
  Link,
  Image.configure({
    upload: (files: File) =>
      new Promise((resolve) => {
        setTimeout(() => resolve(URL.createObjectURL(files)), 500);
      }),
  }),
  Video.configure({
    upload: (files: File) =>
      new Promise((resolve) => {
        setTimeout(() => resolve(URL.createObjectURL(files)), 500);
      }),
  }),
  ImageGif.configure({ GIPHY_API_KEY: import.meta.env.VITE_GIPHY_API_KEY }),
  Blockquote,
  SlashCommand,
  HorizontalRule,
  Code.configure({ toolbar: false }),
  CodeBlock,
  ColumnActionButton,
  Table,
  Iframe,
  ExportPdf.configure({ spacer: true }),
  ImportWord.configure({
    upload: (files: File[]) =>
      Promise.resolve(
        files.map((file) => ({
          src: URL.createObjectURL(file),
          alt: file.name,
        }))
      ),
  }),
  ExportWord,
  TextDirection,
  Mention,
  Attachment.configure({
    upload: (file: any) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string);
          resolve(URL.createObjectURL(blob));
        }, 300);
      }),
  }),
  Katex,
  Excalidraw,
  Mermaid,
  Drawer,
  Twitter,
];

let timeout: ReturnType<typeof setTimeout>;

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function App() {
  const [editorContent, setEditorContent] = useState(DEFAULT);
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [theme, setTheme] = useState("dark");
  const [disable, setDisable] = useState(false);

  const onValueChange = useCallback(
    debounce((value: any) => setEditorContent(value), 300),
    []
  );

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setThumbnail(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearContent = () => setEditorContent("");

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-white">
      {/* Title Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your title"
          className="w-full rounded-lg bg-gray-800 border border-gray-600 p-2 text-white placeholder-gray-400"
        />
      </div>

      {/* Thumbnail Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Thumbnail</label>
        <div className="flex gap-3 items-center">
          <label className="cursor-pointer">
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 hover:bg-gray-700">
              <Upload className="w-4 h-4" />
              Choose Image
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="hidden"
            />
          </label>
          <span className="text-gray-400 text-sm">or</span>
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="Paste image URL"
            className="flex-1 rounded-lg bg-gray-800 border border-gray-600 p-2 text-white placeholder-gray-400"
          />
        </div>

        {thumbnail && (
          <div className="space-y-2">
            <img
              src={thumbnail}
              alt="Thumbnail Preview"
              className="w-full max-w-md rounded-lg border border-gray-600 object-cover aspect-video"
            />
            <button
              onClick={() => setThumbnail("")}
              className="px-3 py-2 rounded-lg bg-red-900 text-white border border-red-700 hover:bg-red-800 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Remove Thumbnail
            </button>
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Content</h3>
          <button
            onClick={clearContent}
            className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 hover:bg-gray-700"
          >
            Clear Content
          </button>
        </div>
        <RichTextEditor
          output="html"
          content={editorContent as any}
          onChangeContent={onValueChange}
          extensions={extensions}
          dark={theme === "dark"}
          disabled={disable}
          bubbleMenu={{
            render({ extensionsNames, editor, disabled }, bubbleDefaultDom) {
              return (
                <>
                  {bubbleDefaultDom}
                  {extensionsNames.includes("twitter") && (
                    <BubbleMenuTwitter disabled={disabled} editor={editor} />
                  )}
                  {extensionsNames.includes("katex") && (
                    <BubbleMenuKatex disabled={disabled} editor={editor} />
                  )}
                  {extensionsNames.includes("excalidraw") && (
                    <BubbleMenuExcalidraw disabled={disabled} editor={editor} />
                  )}
                  {extensionsNames.includes("mermaid") && (
                    <BubbleMenuMermaid disabled={disabled} editor={editor} />
                  )}
                  {extensionsNames.includes("drawer") && (
                    <BubbleMenuDrawer disabled={disabled} editor={editor} />
                  )}
                </>
              );
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;
