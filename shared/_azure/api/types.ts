export interface GetUserResponseDto {
    items: GetUserValueDto[]
    continuationToken: any
    totalCount: number
}

export interface GetUserValueDto {
    user: User
    extensions: any[]
    id: string
    // accessLevel: AccessLevel
    lastAccessedDate: string
    dateCreated: string
    projectEntitlements: any[]
    groupAssignments: any[]

}
export interface User {
    subjectKind: string
    metaType: string
    directoryAlias: string
    domain: string
    principalName: string
    mailAddress: string
    origin: string
    originId: string
    displayName: string
    _links: Links
    url: string
    descriptor: string
}
export interface Links {
    self: Link
    memberships: Link
    membershipState: Link
    storageKey: Link
    avatar: Link
}

export interface Link {
    href: string
}