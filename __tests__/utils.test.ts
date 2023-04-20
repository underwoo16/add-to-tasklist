import {addIssueLinkToBody} from '../src/utils'
import {expect, test, describe} from '@jest/globals'

describe('#addIssueToTrackingIssue', () => {
    test.skip('should not return null', () => {
        const mockIssue = { id: "123", body: "test" }
        const mockTrackingIssue = { id: "456", body: "test" }
        const result = addIssueLinkToBody(mockIssue, mockTrackingIssue)
        expect(result).not.toBeNull()
    })

    test.skip('should add issue and tasklist when no tasklist is present', () => {
        const mockIssue = { id: '123', body: 'test', html_url: 'https://github.com/test/test/issues/1' }
        const mockTrackingIssue = { id: "456", body: "### Description\nIpsem Lorem\n" }
        const result = addIssueLinkToBody(mockIssue, mockTrackingIssue)
        expect(result).toBe("### Description\nIpsem Lorem\n\n```[tasklist]\n### Issues\n- [] https://github.com/test/test/issues/1\n```\n")
    })

    test.skip('should add issue to existing empty tasklist', () => {
        const mockIssue = { id: '123', body: 'test', html_url: 'https://github.com/test/test/issues/1' }
        const mockTrackingIssue = { id: "456", body: "### Description\nIpsem Lorem\n\n```[tasklist]\n### Issues\n```\n" }
        const result = addIssueLinkToBody(mockIssue, mockTrackingIssue)
        expect(result).toBe("### Description\nIpsem Lorem\n\n```[tasklist]\n### Issues\n- [] https://github.com/test/test/issues/1\n```\n")
    })

    test('should add issue to existing tasklist with other issues', () => {
        const mockIssue = { id: '123', body: 'test', html_url: 'https://github.com/test/test/issues/1' }
        const mockTrackingIssue = { id: "456", body: "### Description\nIpsem Lorem\n\n```[tasklist]\n### Issues\n- [] https://github.com/test/test/issues/42\n```\n" }
        const result = addIssueLinkToBody(mockIssue, mockTrackingIssue)
        console.log(result)
        expect(result).toBe("### Description\nIpsem Lorem\n\n```[tasklist]\n### Issues\n- [] https://github.com/test/test/issues/42\n- [] https://github.com/test/test/issues/1\n```\n")
    })

    test('should not add issue when it already exists in tasklist', () => {
        const mockIssue = { id: '123', body: 'test', html_url: 'https://github.com/test/test/issues/1' }
        const mockTrackingIssue = { id: "456", body: "### Description\nIpsem Lorem\n\n```[tasklist]\n### Issues\n- [] https://github.com/test/test/issues/42\n- [] https://github.com/test/test/issues/1\n```\n" }
        const result = addIssueLinkToBody(mockIssue, mockTrackingIssue)
        expect(result).toBe("### Description\nIpsem Lorem\n\n```[tasklist]\n### Issues\n- [] https://github.com/test/test/issues/42\n- [] https://github.com/test/test/issues/1\n```\n")
    })
})


