import { enterpriseDashboardMock, enterpriseDashboardScenarios, organizationOptions } from '../mock/enterpriseDashboard'

export { organizationOptions }

// Adapter boundary: replace this Mock return with the future enterprise aggregate API.
export function getEnterpriseDashboardOverview({ orgId = 'ORG001', scenario = 'standard' } = {}) {
  const snapshot = enterpriseDashboardScenarios[scenario] || enterpriseDashboardMock
  const organization = organizationOptions.find((item) => item.orgId === orgId) || organizationOptions[0]
  return { ...snapshot, scope: { ...snapshot.scope, orgId: organization.orgId, orgName: organization.name } }
}
