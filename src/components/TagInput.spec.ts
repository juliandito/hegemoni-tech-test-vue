import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'

import TagInput from './TagInput.vue'

type TagInputWrapper = VueWrapper<InstanceType<typeof TagInput>>

function mountTagInput(): TagInputWrapper {
  return mount(TagInput)
}

function getInput(wrapper: TagInputWrapper) {
  return wrapper.get('input[aria-label="Add a tag"]')
}

function getTagLabels(wrapper: TagInputWrapper): string[] {
  return wrapper.findAll('li[role="listitem"] span').map((node) => node.text())
}

async function addTag(wrapper: TagInputWrapper, rawValue: string): Promise<void> {
  const input = getInput(wrapper)
  await input.setValue(rawValue)
  await input.trigger('keydown', { key: 'Enter' })
}

describe('TagInput', () => {
  it('TH-01: renders input with the default placeholder', () => {
    const wrapper = mountTagInput()
    const input = getInput(wrapper)

    expect(input.attributes('aria-label')).toBe('Add a tag')
    expect(input.attributes('placeholder')).toBe('Type a tag and press Enter')
  })

  it('TH-02 + TH-03: pressing Enter adds a tag and clears the input', async () => {
    const wrapper = mountTagInput()
    const input = getInput(wrapper)

    await input.setValue('vue')
    await input.trigger('keydown', { key: 'Enter' })

    expect(getTagLabels(wrapper)).toEqual(['vue'])
    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('TH-04: trims whitespace before validation', async () => {
    const wrapper = mountTagInput()

    await addTag(wrapper, ' react ')

    expect(getTagLabels(wrapper)).toEqual(['react'])
  })

  it('TH-05: does not add empty/whitespace-only tags', async () => {
    const wrapper = mountTagInput()

    await addTag(wrapper, '   ')

    expect(getTagLabels(wrapper)).toEqual([])
  })

  it('TH-06: rejects duplicate tags (case-sensitive)', async () => {
    const wrapper = mountTagInput()

    await addTag(wrapper, 'vue')
    await addTag(wrapper, 'vue')

    expect(getTagLabels(wrapper)).toEqual(['vue'])
  })

  it('TH-07: treats "Vue" and "vue" as different tags', async () => {
    const wrapper = mountTagInput()

    await addTag(wrapper, 'Vue')
    await addTag(wrapper, 'vue')

    expect(getTagLabels(wrapper)).toEqual(['Vue', 'vue'])
  })

  it('TH-08: renders one remove button per tag', async () => {
    const wrapper = mountTagInput()

    await addTag(wrapper, 'vue')
    await addTag(wrapper, 'react')

    const removeButtons = wrapper.findAll('button[aria-label^="Remove tag "]')
    expect(removeButtons).toHaveLength(2)
  })

  it('TH-09: clicking remove deletes the correct tag and preserves order', async () => {
    const wrapper = mountTagInput()

    await addTag(wrapper, 'vue')
    await addTag(wrapper, 'react')
    await addTag(wrapper, 'svelte')

    const removeReactButton = wrapper.get('button[aria-label="Remove tag react"]')
    await removeReactButton.trigger('click')

    expect(getTagLabels(wrapper)).toEqual(['vue', 'svelte'])
  })

  it('TH-10: renders tags as list/listitem semantic roles', async () => {
    const wrapper = mountTagInput()

    await addTag(wrapper, 'vue')
    await addTag(wrapper, 'react')

    const list = wrapper.get('ul[role="list"]')
    const items = wrapper.findAll('li[role="listitem"]')

    expect(list.attributes('role')).toBe('list')
    expect(items).toHaveLength(2)
  })

  it('TH-11: remove button has a descriptive aria-label', async () => {
    const wrapper = mountTagInput()

    await addTag(wrapper, 'vue')

    const removeButton = wrapper.get('button[aria-label="Remove tag vue"]')
    expect(removeButton.attributes('aria-label')).toBe('Remove tag vue')
  })

  it('TH-15: input has aria-label="Add a tag"', () => {
    const wrapper = mountTagInput()
    const input = wrapper.get('input')

    expect(input.attributes('aria-label')).toBe('Add a tag')
  })
})
