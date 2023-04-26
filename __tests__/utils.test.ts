import {addIssueLinkToBody} from '../src/utils'

describe('#addIssueLinkToBody', () => {
  test('should add issue and tasklist when body is empty string', () => {
    const issueUrl = 'https://github.com/test/test/issues/1'
    const trackingIssueBody = ''
    const result = addIssueLinkToBody(issueUrl, trackingIssueBody)
    expect(result).toBe(
      '```[tasklist]\n### Tasks\n- [ ] https://github.com/test/test/issues/1\n```'
    )
  })

  test('should add issue and tasklist when body is null', () => {
    const issueUrl = 'https://github.com/test/test/issues/1'
    const trackingIssueBody = null
    const result = addIssueLinkToBody(issueUrl, trackingIssueBody)
    expect(result).toBe(
      '```[tasklist]\n### Tasks\n- [ ] https://github.com/test/test/issues/1\n```'
    )
  })

  test('should add issue and tasklist when body is undefined', () => {
    const issueUrl = 'https://github.com/test/test/issues/1'
    const trackingIssueBody = undefined
    const result = addIssueLinkToBody(issueUrl, trackingIssueBody)
    expect(result).toBe(
      '```[tasklist]\n### Tasks\n- [ ] https://github.com/test/test/issues/1\n```'
    )
  })

  test('should add issue and tasklist when no tasklist is present', () => {
    const issueUrl = 'https://github.com/test/test/issues/1'
    const trackingIssueBody = '### Description\nIpsem Lorem\n'
    const result = addIssueLinkToBody(issueUrl, trackingIssueBody)
    expect(result).toBe(
      '### Description\nIpsem Lorem\n\n```[tasklist]\n### Tasks\n- [ ] https://github.com/test/test/issues/1\n```'
    )
  })

  test('should add issue to existing empty tasklist', () => {
    const issueUrl = 'https://github.com/test/test/issues/1'
    const trackingIssueBody =
      '### Description\nIpsem Lorem\n\n```[tasklist]\n### Tasks\n```\n'
    const result = addIssueLinkToBody(issueUrl, trackingIssueBody)
    expect(result).toBe(
      '### Description\nIpsem Lorem\n\n```[tasklist]\n### Tasks\n- [ ] https://github.com/test/test/issues/1\n```\n'
    )
  })

  test('should add issue to existing tasklist with other issues', () => {
    const issueUrl = 'https://github.com/test/test/issues/1'
    const trackingIssueBody =
      '### Description\nIpsem Lorem\n\n```[tasklist]\n### Tasks\n- [ ] https://github.com/test/test/issues/42\n```\n'
    const result = addIssueLinkToBody(issueUrl, trackingIssueBody)
    expect(result).toBe(
      '### Description\nIpsem Lorem\n\n```[tasklist]\n### Tasks\n- [ ] https://github.com/test/test/issues/42\n- [ ] https://github.com/test/test/issues/1\n```\n'
    )
  })

  test('should not add issue when it already exists in tasklist', () => {
    const issueUrl = 'https://github.com/test/test/issues/1'
    const trackingIssueBody =
      '### Description\nIpsem Lorem\n\n```[tasklist]\n### Tasks\n- [ ] https://github.com/test/test/issues/42\n- [ ] https://github.com/test/test/issues/1\n```\n'
    const result = addIssueLinkToBody(issueUrl, trackingIssueBody)
    expect(result).toBe(
      '### Description\nIpsem Lorem\n\n```[tasklist]\n### Tasks\n- [ ] https://github.com/test/test/issues/42\n- [ ] https://github.com/test/test/issues/1\n```\n'
    )
  })

  test('should add issue when there are multiple tasklists', () => {
    const issueUrl = 'https://github.com/test/test/issues/1'
    const trackingIssueBody =
      '### Description\nIpsem Lorem\n\n```[tasklist]\n### Tasks\n- [ ] https://github.com/test/test/issues/42\n```\n```[tasklist]\n### API Changes\n- [ ] https://github.com/test/test/issues/43\n```'
    const result = addIssueLinkToBody(issueUrl, trackingIssueBody)
    expect(result).toBe(
      '### Description\nIpsem Lorem\n\n```[tasklist]\n### Tasks\n- [ ] https://github.com/test/test/issues/42\n- [ ] https://github.com/test/test/issues/1\n```\n```[tasklist]\n### API Changes\n- [ ] https://github.com/test/test/issues/43\n```'
    )
  })

  test('should not add issue when link is present in another tasklist', () => {
    const issueUrl = 'https://github.com/test/test/issues/1'
    const trackingIssueBody =
      '### Description\nIpsem Lorem\n\n```[tasklist]\n### Tasks\n- [ ] https://github.com/test/test/issues/42\n```\n```[tasklist]\n### API Changes\n- [ ] https://github.com/test/test/issues/1\n```'
    const result = addIssueLinkToBody(issueUrl, trackingIssueBody)
    expect(result).toBe(
      '### Description\nIpsem Lorem\n\n```[tasklist]\n### Tasks\n- [ ] https://github.com/test/test/issues/42\n```\n```[tasklist]\n### API Changes\n- [ ] https://github.com/test/test/issues/1\n```'
    )
  })

  test('should add issue to tasklist with non-link items', () => {
    const issueUrl = 'https://github.com/test/test/issues/1'
    const trackingIssueBody =
      '### Description\nIpsem Lorem\n\n```[tasklist]\n### Tasks\n- [ ] This is a plain-text task\n```\n'
    const result = addIssueLinkToBody(issueUrl, trackingIssueBody)
    expect(result).toBe(
      '### Description\nIpsem Lorem\n\n```[tasklist]\n### Tasks\n- [ ] This is a plain-text task\n- [ ] https://github.com/test/test/issues/1\n```\n'
    )
  })

  test('should add issue to tasklist with empty items', () => {
    const issueUrl = 'https://github.com/test/test/issues/1'
    const trackingIssueBody =
      '### Description\nIpsem Lorem\n\n```[tasklist]\n### Tasks\n- [ ]\n```\n'
    const result = addIssueLinkToBody(issueUrl, trackingIssueBody)
    expect(result).toBe(
      '### Description\nIpsem Lorem\n\n```[tasklist]\n### Tasks\n- [ ]\n- [ ] https://github.com/test/test/issues/1\n```\n'
    )
  })

  test('should add issue to tasklist with checked items', () => {
    const issueUrl = 'https://github.com/test/test/issues/1'
    const trackingIssueBody =
      '### Description\nIpsem Lorem\n\n```[tasklist]\n### Tasks\n- [x] a checked item\n```\n'
    const result = addIssueLinkToBody(issueUrl, trackingIssueBody)
    expect(result).toBe(
      '### Description\nIpsem Lorem\n\n```[tasklist]\n### Tasks\n- [x] a checked item\n- [ ] https://github.com/test/test/issues/1\n```\n'
    )
  })

  test('should add issue to tasklist with no title', () => {
    const issueUrl = 'https://github.com/test/test/issues/1'
    const trackingIssueBody =
      '### Description\nIpsem Lorem\n\n```[tasklist]\n```'
    const result = addIssueLinkToBody(issueUrl, trackingIssueBody)
    expect(result).toBe(
      '### Description\nIpsem Lorem\n\n```[tasklist]\n- [ ] https://github.com/test/test/issues/1\n```'
    )
  })
})
