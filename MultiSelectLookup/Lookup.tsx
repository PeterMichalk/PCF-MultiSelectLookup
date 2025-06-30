import * as React from 'react';
import { ExtendedUtils, ExtendedContext, ExecuteRequest, ExtendedWebApi, ILookupRecord } from './types';
import { ILookupProps } from './types';
import { LookupItem } from './LookupItem';

export const Lookup = (props: ILookupProps) => {
    const [lookups, setLookups] = React.useState(props.lookUpRecords);
    //const imageUrl = props.context.parameters.controlImageURl.raw;

    React.useEffect(() => {
        setLookups(props.lookUpRecords);
    }, [props])

    const removeItem = (selectedIt: ILookupRecord) => {
        setLookups(lookups.filter((it: ILookupRecord) => !(it.id == selectedIt.id && it.entityType == selectedIt.entityType)));
        RemoveItemFromGrid(selectedIt.id);
    };

    const OpenLookupRecord = async (lookupRef: ILookupRecord) => {
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
    //     let lookUpValue: null | ILookupRecord[] = null;
    //     if (lookupFeildName !== null) {
    //         lookUpValue = Xrm.Page.getAttribute(lookupFeildName)?.getValue() as ILookupRecord[];
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
        <div style={{
            display: 'flex',
            borderRadius: "4px",
            minHeight: '40px',
            maxHeight: "200px",
            overflowY: 'auto',
            border: '1px solid black',
            padding: "4px",
            alignItems: "flex-starts"
        }}>
            <LookupItem />
            {/* <div>
                {lookups.map((lookup: ILookupRecord) => {
                    return <div key={lookup.id}>
                        {imageUrl && <img src={imageUrl} alt="" height={20} width={20} />}
                        <Link
                            onClick={() => OpenLookupRecord(lookup)}
                            underline>
                            {lookup.name as string}
                        </Link>
                        <span onClick={() => removeItem(lookup)}>

                        </span>
                    </div>
                }

                )}
                <span className='divSearch ' onClick={OpenLookupSearch}>
            </span>
            </div> */}
        </div>
    );
}