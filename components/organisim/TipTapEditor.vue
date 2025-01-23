<template>
  <div class="w-full">
    <EditorContent class="w-full" :editor="editor" />
    <section
      v-if="editor"
      class="flex items-center flex-wrap gap-x-4 px-2 w-full border-t-0"
    >
      <div class="flex gap-2">
        <button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        >
          <IconMolecule size="24" :name="IconType.h1" color="text-gray-600" />
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        >
          <IconMolecule size="24" :name="IconType.h2" color="text-gray-600" />
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        >
          <IconMolecule size="24" :name="IconType.h3" color="text-gray-600" />
        </button>
        <button
          @click="editor.chain().focus().setParagraph().run()"
          :class="{ 'is-active': editor.isActive('paragraph') }"
        >
          <IconMolecule
            size="18"
            :name="IconType.paragraph"
            color="text-gray-600"
          />
        </button>

        <button
          @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          :class="{ 'bg-gray-200': editor.isActive('bold') }"
        >
          <IconMolecule size="18"   :name="IconType.bold" color="text-gray-600" />
        </button>
        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          :class="{ 'bg-gray-200': editor.isActive('italic') }"
        >
          <IconMolecule size="18"   :name="IconType.italic" color="text-gray-600" />
        </button>

        <button
          @click="editor.chain().focus().toggleUnderline().run()"
          :disabled="!editor.can().chain().focus().toggleUnderline().run()"
          :class="{ 'bg-gray-200': editor.isActive('underline') }"
        >
          <IconMolecule size="18"   :name="IconType.underline" color="text-gray-600" />
        </button>
        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
          :class="{ 'bg-gray-200': editor.isActive('strike') }"
        >
          <IconMolecule size="18"   :name="IconType.strike" color="text-gray-600" />
        </button>
        <button
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }"
        >
          <IconMolecule
            size="18"
            :name="IconType.blockquote"
            color="text-gray-600"
          />
        </button>

        <button
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
        >
          <IconMolecule
            size="18"
            :name="IconType.listNum"
            color="text-gray-600"
          />
        </button>
        <button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
        >
          <IconMolecule size="18" :name="IconType.list" color="text-gray-600" />
        </button>
        <button 
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().chain().focus().undo().run()"
        >
          <IconMolecule size="18" :name="IconType.undo" color="text-gray-600" />
        </button>
        <button
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().chain().focus().redo().run()"
        >
          <IconMolecule size="18" :name="IconType.redo" color="text-gray-600" />
        </button>
        <button
          @click="addLink"
          :class="{ 'is-active': editor.isActive('link') }"
        >
          <IconMolecule size="18" :name="IconType.link" color="text-gray-600" />
        </button>
        <input
          type="color"
          @input="onColorChange"
          :value="currentColor"
          class="w-8 h-8"
        />

        <button
          @click="editor.chain().focus().unsetColor().run()"
          class="px-2 py-1 border border-gray-300 rounded"
        >
          Clear color
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from "@tiptap/vue-3";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Strike from "@tiptap/extension-strike";
import Link from "@tiptap/extension-link";
import IconMolecule from "~/components/atomos/Icon.vue";
import { IconType } from "~/data/iconsType";
import { ref } from "vue";

// Variable para mantener el color actual
const currentColor = ref("#000000");

// Función para manejar el cambio de color
const onColorChange = (e) => {
  currentColor.value = e.target.value;
  editor.value.chain().focus().setColor(e.target.value).run();
};

const editor = useEditor({
  editorProps: {
    attributes: {
      class:
        "border-t border-l border-r border-gray-400 p-4 min-h-[12rem] max-h-[12rem] overflow-y-auto  prose max-w-none",
    },
  },
  content: "<p>I'm running Tiptap with Vue.js. 🎉</p>",
  extensions: [
    StarterKit,
    TextStyle,
    Underline,
    Strike,
    Link.configure({
      openOnClick: true,
      HTMLAttributes: {
        class: 'text-blue-500 underline',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    }),
    Color.configure({ types: [TextStyle.name] }),
  ],
});

// Add this method to handle link insertion
const addLink = () => {
  const url = window.prompt('URL')
  if (url) {
    // Add http:// if the URL doesn't start with http:// or https://
    const httpUrl = url.match(/^https?:\/\//) ? url : `https://${url}`
    editor.value.chain().focus().setLink({ href: httpUrl }).run()
  }
}
</script>

<style>
/* Reduce spacing in ordered and unordered lists */
.prose ul,
.prose ol {
  margin-top: 0.5em !important;
  margin-bottom: 0.5em !important;
}

.prose li {
  margin-top: 0.2em !important;
  margin-bottom: 0.2em !important;
}
</style>
