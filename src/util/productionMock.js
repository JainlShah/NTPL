export const CuttingProductionResponse = () => {
  return {
    responseStatusList: {
      statusList: [
        {
          statusCode: 200,
          statusType: "success",
          statusDesc: "Data get Successfully",
        },
      ],
    },
    responseObject: {
      data: [
        {
          rollId: "4457b339-a407-4029-b9ff-32d8ebc6aa7c",
          rollNumber: "IC/1A/1234_01",
          jobNumber: "NTPL/09/24/10434",
          workOrder: "WO/11/09/11168",
          drawingNumber: "MEHI-9089(C-4725)(A)",
          width: 240,
          weight: 140.804,
          thickness: 0.27,
          stack: 50,
          rollStatus: "ready",
          slittingProgramId: "e35c5469-a2ce-4fb5-bd19-3cdc7c604cf4",
        },
        {
          rollId: "426070ab-1b7c-4412-b583-65d2d2fcba8b",
          rollNumber: "IC/1A/1234_02",
          jobNumber: "NTPL/09/24/10434",
          workOrder: "WO/11/09/11168",
          drawingNumber: "MEHI-9089(C-4725)(A)",
          width: 230,
          weight: 191.45,
          thickness: 0.27,
          stack: 50,
          rollStatus: "ready",
          slittingProgramId: "e35c5469-a2ce-4fb5-bd19-3cdc7c604cf4",
        },
        {
          rollId: "4457b339-a407-4029-b9ff-32d8ebc6aa7c",
          rollNumber: "IC/1A/1234_03",
          jobNumber: "NTPL/09/24/10434",
          workOrder: "WO/11/09/11168",
          drawingNumber: "MEHI-9089(C-4725)(A)",
          width: 220,
          weight: 108.111,
          thickness: 0.27,
          stack: 50,
          rollStatus: "ready",
          slittingProgramId: "e35c5469-a2ce-4fb5-bd19-3cdc7c604cf4",
        },
        {
          rollId: "426070ab-1b7c-4412-b583-65d2d2fcba8b",
          rollNumber: "IC/1A/1234_04",
          jobNumber: "NTPL/09/24/10434",
          workOrder: "WO/11/09/11168",
          drawingNumber: "MEHI-9089(C-4725)(A)",
          width: 230,
          weight: 135.14,
          thickness: 0.27,
          stack: 50,
          rollStatus: "ready",
          slittingProgramId: "e35c5469-a2ce-4fb5-bd19-3cdc7c604cf4",
        },
      ],
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
      },
    },
  };
};

export const PackingProductionResponse = () => {
  return {
    responseStatusList: {
      statusList: [
        {
          statusCode: 200,
          statusType: "success",
          statusDesc: "Getting Job Detail List successfully",
        },
      ],
    },
    responseObject: {
      data: [
        {
          jobNumber: "NTPL/09/24/10434",
          workOrder: "WO/11/09/11168",
          drawingNumber: "MEHI-9089(C-4725)(A)",
          jobAttributes: [
            {
              width: 240,
              weight: 140.804,
              stack: 50,
              packedWeight: null,
              scrap: null,
              excessWeight: null,
            },
            {
              width: 230,
              weight: 191.45,
              stack: 50,
              packedWeight: null,
              scrap: null,
              excessWeight: null,
            },
            {
              width: 220,
              weight: 108.111,
              stack: 50,
              packedWeight: null,
              scrap: null,
              excessWeight: null,
            },
            {
              width: 230,
              weight: 135.14,
              stack: 50,
              packedWeight: null,
              scrap: null,
              excessWeight: null,
            },
          ],
        },
      ],
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 2,
        totalPages: 1,
      },
    },
  };
};
