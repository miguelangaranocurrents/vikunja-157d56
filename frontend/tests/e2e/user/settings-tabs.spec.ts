import {test, expect} from '../../support/fixtures'

test.describe('User Settings', () => {
	test('Keeps a setting saved in another tab when saving the name', async ({authenticatedPage: page, apiContext, userToken}) => {
		await page.goto('/user/settings/general')
		await page.waitForLoadState('networkidle')
		const nameInput = page.locator('.general-settings input.input').first()
		await expect(nameInput).toBeEnabled()

		const otherTab = await page.context().newPage()
		await otherTab.goto('/user/settings/general')
		await otherTab.waitForLoadState('networkidle')
		const weekStart = otherTab.getByLabel('Week starts on')
		await weekStart.scrollIntoViewIfNeeded()
		await weekStart.selectOption({value: '3'})
		await otherTab.locator('[data-cy="saveGeneralSettings"]').click()
		await expect(otherTab.locator('.global-notification')).toContainText('Success')

		await page.bringToFront()
		await nameInput.fill('Ada Lovelace')
		await page.locator('[data-cy=saveGeneralSettings]').click()
		await expect(page.locator('.global-notification')).toContainText('Success')
		await expect(page.locator('.username')).toHaveText('Ada Lovelace')

		await otherTab.reload()
		await otherTab.waitForLoadState('networkidle')
		await expect(otherTab.getByLabel('Week starts on')).toHaveValue('3')
	})
})
