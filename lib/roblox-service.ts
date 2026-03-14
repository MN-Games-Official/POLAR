import { config } from "@/lib/config";

export class RobloxService {
  constructor(private readonly apiKey: string) {}

  async getMembership(groupId: string, userId: string) {
    const filter = encodeURIComponent(`user=='users/${userId}'`);
    const url = `${config.roblox.cloudBase}/cloud/v2/groups/${groupId}/memberships?maxPageSize=1&filter=${filter}`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": this.apiKey
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Failed to get Roblox membership.");
    }

    const data = await response.json();
    return data.groupMemberships?.[0] ?? null;
  }

  async getRolesMap(groupId: string) {
    const response = await fetch(
      `${config.roblox.groupsBase}/v1/groups/${groupId}/roles`,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Roblox roles.");
    }

    const data = await response.json();
    return Object.fromEntries(
      (data.roles as Array<{ rank: number; id: number }>).map((role) => [
        role.rank,
        role.id
      ])
    ) as Record<number, number>;
  }

  async validateKey() {
    const response = await fetch(
      `${config.roblox.groupsBase}/v1/groups/${config.roblox.sampleGroupId}/roles`,
      {
        headers: { "x-api-key": this.apiKey },
        cache: "no-store"
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Roblox API key validation failed.");
    }

    return true;
  }

  async promoteUser(groupId: string, membershipId: string, targetRole: string) {
    const normalizedRole = await normalizeTargetRole(groupId, targetRole, this);
    const response = await fetch(
      `${config.roblox.cloudBase}/cloud/v2/groups/${groupId}/memberships/${membershipId}`,
      {
        method: "PATCH",
        headers: {
          "x-api-key": this.apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role: `groups/${groupId}/roles/${normalizedRole}`
        })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Promotion failed.");
    }

    return response.json();
  }
}

export async function normalizeTargetRole(
  groupId: string,
  targetRole: string,
  robloxService: RobloxService
) {
  if (targetRole.startsWith("groups/") && targetRole.includes("/roles/")) {
    return targetRole.split("/roles/")[1];
  }

  if (targetRole.startsWith("rank:")) {
    const rankNumber = Number(targetRole.replace("rank:", "").trim());
    const map = await robloxService.getRolesMap(groupId);
    const roleId = map[rankNumber];

    if (!roleId) {
      throw new Error(`Rank ${rankNumber} not found in Roblox group ${groupId}.`);
    }

    return String(roleId);
  }

  return targetRole;
}
