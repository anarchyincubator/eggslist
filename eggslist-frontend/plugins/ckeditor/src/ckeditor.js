/**
 * @license Copyright (c) 2014-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor.js";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials.js";
import Heading from "@ckeditor/ckeditor5-heading/src/heading.js";
import Image from "@ckeditor/ckeditor5-image/src/image.js";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload.js";
import Link from "@ckeditor/ckeditor5-link/src/link.js";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph.js";
import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter.js";

class Editor extends ClassicEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
  Essentials,
  Heading,
  Image,
  ImageUpload,
  Link,
  Paragraph,
  SimpleUploadAdapter,
];

// Editor configuration.
Editor.defaultConfig = {
  toolbar: {
    items: ["heading", "|", "undo", "redo", "|", "imageUpload", "link"],
  },
  language: "en",
};

export default Editor;
