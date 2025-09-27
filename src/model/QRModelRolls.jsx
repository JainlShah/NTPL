class QRModelRolls {
  constructor(
    coilNumber = null,
    rollNumber = null,
    qrCodeNumber = null,
    jobNumber = null,
    drawingNumber = null,
    width = null,
    weight = null,
    grade = null,
    materialType = null,
    registeredDate = null,
    status = null
  ) {
    this.coilNumber = coilNumber;
    this.rollNumber = rollNumber;
    this.qrCodeNumber = qrCodeNumber;
    this.jobNumber = jobNumber;
    this.drawingNumber = drawingNumber;
    this.width = width;
    this.weight = weight;
    this.grade = grade;
    this.materialType = materialType;
    this.registeredDate = registeredDate;
    this.status = status
  }
}

export default QRModelRolls;
