import {addIssueLinkToBody} from '../src/utils'

describe('#addIssueToTrackingIssue', () => {
  test('should not return null', () => {
    const result = addIssueLinkToBody('test', 'test')
    expect(result).not.toBeNull()
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
})
