<script setup lang="ts">
import { ref, type Ref } from 'vue'

// interfaces & types
interface TagItem {
  id: string
  label: string
}
type TagInputValue = string
type TagList = TagItem[]
type TagIdentifier = TagItem['id']

// ref
const inputValue: Ref<TagInputValue> = ref('')
const tags: Ref<TagList> = ref([])


function createTag(label: string): TagItem {
  return {
    id: label,
    label,
  }
}

function hasTag(candidate: string, currentTags: TagList): boolean {
  return currentTags.some((tag: TagItem) => tag.label === candidate)
}

function resetInput(): void {
  inputValue.value = ''
}

function addTag(): void {
  // trim
  const candidate: string = inputValue.value.trim()

  // check dupe
  if (candidate === '' || hasTag(candidate, tags.value)) {
    return // later can alert
  }

  // push
  tags.value.push(createTag(candidate))
  resetInput()
}

function removeTag(tagId: TagIdentifier): void {
  tags.value = tags.value.filter((tag: TagItem) => tag.id !== tagId)
}

function handleInputKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Enter') {
    return
  }

  event.preventDefault()
  addTag()
}
</script>

<template>
  <section class="tag-input-card">
    <input
      v-model="inputValue"
      type="text"
      aria-label="Add a tag"
      placeholder="Type a tag and press Enter"
      @keydown="handleInputKeydown"
    />

    <ul class="tag-list" role="list">
      <li v-for="tag in tags" :key="tag.id" role="listitem">
        <span>{{ tag.label }}</span>
        <button type="button" :aria-label="`Remove tag ${tag.label}`" @click="removeTag(tag.id)">
          ×
        </button>
      </li>
    </ul>
  </section>
</template>