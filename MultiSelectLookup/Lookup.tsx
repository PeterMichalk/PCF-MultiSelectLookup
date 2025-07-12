import * as React from 'react';
import { ExtendedUtils, ExtendedContext, ExecuteRequest, ExtendedWebApi, IEntityRef } from './types';
import { ILookupProps } from './types';
import { LookupItem } from './LookupItem';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { Icon } from '@fluentui/react/lib/Icon';
initializeIcons();

export const Lookup = (props: ILookupProps) => {
    const [lookups, setLookups] = React.useState(props.lookUpRecords);
    const [iconSearchHovered, setIconSearchHovered] = React.useState<boolean>(false);

    //const imageUrl = props.context.parameters.controlImageURl.raw;

    React.useEffect(() => {
        setLookups(props.lookUpRecords);
    }, [props])

    const removeItem = (selectedIt: IEntityRef) => {
        setLookups(lookups.filter((it: IEntityRef) => !(it.id == selectedIt.id && it.entityType == selectedIt.entityType)));
        RemoveItemFromGrid(selectedIt.id);
    };

    const OpenLookupRecord = async (lookupRef: IEntityRef) => {
        try {
            const pageInput = {};

            const navigationOptions: ComponentFramework.NavigationApi.EntityFormOptions = {
                entityName: lookupRef.entityType,
                entityId: lookupRef.id,
                width: 80,
                height: 70,
                windowPosition: 1 // Centered
            };

            await props.context.navigation.openForm(navigationOptions, pageInput);
        } catch (error) {
            console.error("Failed to open contact record:", error);
        }
    }

    const RemoveItemFromGrid = async (id: string) => {
        const context = props.context as ExtendedContext;

        // Get relationship and target entity type from extended utils
        const utils = context.utils as ExtendedUtils;
        const descriptorParams = utils._customControlProperties?.descriptor?.Parameters;

        const relationshipName = descriptorParams?.["RelationshipName"];
        let entityToOpen = descriptorParams?.["TargetEntityType"];

        // Fallback to target entity type from records property
        if (!entityToOpen) {
            entityToOpen = context.parameters.records.getTargetEntityType();
        }

        // Get primary entity and ID from extended page context
        const primaryEntity = context.page?.entityTypeName;
        const primaryEntityId = context.page?.entityId;

        if (!relationshipName || !primaryEntity || !primaryEntityId) {
            console.error("Required parameters are missing. Aborting disassociation.");
            return;
        }

        // Construct the disassociate request
        const disassociateRequest: ExecuteRequest = {
            getMetadata: () => ({
                boundParameter: null,
                parameterTypes: {},
                operationType: 2,
                operationName: "Disassociate"
            }),
            relationship: relationshipName,
            target: {
                entityType: primaryEntity,
                id: primaryEntityId
            },
            relatedEntityId: id
        };

        const webApi = context.webAPI as ExtendedWebApi;

        if (webApi.execute) {
            try {
                const response = await webApi.execute(disassociateRequest);
                if (response.ok) {
                    context.parameters.records.refresh();
                }
            } catch (ex: unknown) {
                console.error("Error", ex);
            }
        }
    }

    // const OpenLookupSearch = async (): Promise<void> => {
    //     const context = props.context as ExtendedContext;
    //     const utils = context.utils as ExtendedUtils;

    //     const descriptorParams = utils._customControlProperties?.descriptor?.Parameters;

    //     const relationshipName = descriptorParams?.["RelationshipName"];
    //     let entityToOpen = descriptorParams?.["TargetEntityType"];

    //     if (!entityToOpen) {
    //         entityToOpen = context.parameters.records.getTargetEntityType();
    //     }

    //     const primaryEntity = context.page?.entityTypeName;
    //     const primaryEntityId = context.page?.entityId;

    //     if (!relationshipName || !primaryEntity || !primaryEntityId || !entityToOpen) {
    //         console.error("Missing required values for lookup association.");
    //         return;
    //     }

    //     const lookupFeildName: string | null = props.context.parameters.parentLookUpFieldName.raw;
    //     let lookUpValue: null | IEntityRef[] = null;
    //     if (lookupFeildName !== null) {
    //         lookUpValue = Xrm.Page.getAttribute(lookupFeildName)?.getValue() as IEntityRef[];
    //     }

    //     const lookupOptions: ILookupOptions = {
    //         defaultEntityType: entityToOpen,
    //         entityTypes: [entityToOpen],
    //         allowMultiSelect: true,
    //         disableMru: true,
    //         filters: [{
    //             filterXml: `<filter type="and">
    // 		                    <condition attribute="${lookUpValue?.[0]?.entityType.concat('id') ?? ''}" operator="ne" value="${lookUpValue?.[0]?.id?.replace("{", "")?.replace("}", "") ?? ""}" />
    // 	                    </filter>`,
    //             entityLogicalName: entityToOpen
    //         }]
    //     };

    //     try {
    //         const selectedRecords = await context.utils.lookupObjects(lookupOptions);

    //         if (!selectedRecords || selectedRecords.length === 0) return;

    //         const relatedEntities = selectedRecords.map(rec => ({
    //             id: rec.id.replace("{", "").replace("}", ""),
    //             entityType: rec.entityType
    //         }));

    //         const associateRequest: ExecuteRequest = {
    //             getMetadata: () => ({
    //                 boundParameter: null,
    //                 parameterTypes: {},
    //                 operationType: 2,
    //                 operationName: "Associate"
    //             }),
    //             target: {
    //                 entityType: primaryEntity,
    //                 id: primaryEntityId
    //             },
    //             relatedEntities: relatedEntities,
    //             relationship: relationshipName,
    //         };

    //         const webApi = context.webAPI as ExtendedWebApi;

    //         if (webApi.execute) {
    //             await webApi.execute(associateRequest);
    //             context.parameters.records.refresh();
    //         }
    //     } catch (error: unknown) {
    //         console.error("Lookup or associate operation failed:", error);
    //     }
    // };

    return (
        <div style={{ position: 'relative', margin: '2px', boxSizing: 'border-box' }}>
            <div style={{
                position: 'absolute',
                top: '4px',
                right: '18px',
                zIndex: 1,
                fontSize: '16px',
                fontWeight: 400,
                cursor: 'pointer'
            }}
                onMouseEnter={() => setIconSearchHovered(true)}
                onMouseLeave={() => setIconSearchHovered(false)}
            >
                <Icon
                    style={{
                        color: iconSearchHovered ? 'rgb(17, 94, 163)' : 'rgb(97, 97, 97)'
                    }}
                    iconName='Search'
                />
            </div>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                borderRadius: "4px",
                backgroundColor: '#f3f3f3',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                gap: "2px",
                height: "auto",
                minHeight: '30px',
                maxHeight: "70px",
                width: "100%",
                overflowY: 'auto',
                padding: "4px",
                paddingRight: "20px",
                alignItems: "flex-starts",
                boxSizing: 'border-box'
            }}>
                {lookups.map((lookup: IEntityRef) => {
                    return (
                        <LookupItem
                            key={lookup.id}
                            record={lookup}
                            entityImageURL={""}
                            delete={(entRef: IEntityRef) => { console.log(entRef) }}
                        />
                    )
                }

                )}
            </div>
        </div>
    );
}