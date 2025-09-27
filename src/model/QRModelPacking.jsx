class QRModelPacking {
  constructor(
    qrCodeNumber = null,
    jobNumber = null,
    drawingNumber = null,
    workOrder = null,
    customerName = null,
    packedWeight = null,
    poNumber = null,
    packingDate = null
  ) {
    this.qrCodeNumber = qrCodeNumber;
    this.jobNumber = jobNumber;
    this.drawingNumber = drawingNumber;
    this.workOrder = workOrder;
    this.customerName = customerName;
    this.packedWeight = packedWeight;
    this.poNumber = poNumber;
    this.packingDate = packingDate;
  }
}

export default QRModelPacking;
