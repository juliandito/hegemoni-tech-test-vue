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

<style scoped>
.tag-input-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #d7dce3;
  border-radius: 0.75rem;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(16, 24, 40, 0.06);
  max-width: 480px;
}

.tag-input-card input {
  width: 100%;
  padding: 0.65rem 0.8rem;
  border: 1px solid #c7ced8;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.tag-input-card input:focus {
  border-color: #2b6cb0;
  box-shadow: 0 0 0 3px rgba(43, 108, 176, 0.15);
}

.tag-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-list li {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #f1f5f9;
  border: 1px solid #d5dde8;
  border-radius: 999px;
  padding: 0.3rem 0.55rem;
  font-size: 0.85rem;
  color: #223042;
}

.tag-list button {
  border: 0;
  background: transparent;
  color: #44566c;
  cursor: pointer;
  line-height: 1;
  font-size: 1rem;
  padding: 0;
}

.tag-list button:hover {
  color: #0f172a;
}
</style>