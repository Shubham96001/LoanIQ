from pydantic import BaseModel, EmailStr, Field, field_validator


class LoanApplicationCreate(BaseModel):
    full_name: str = Field(alias="fullName")
    email: EmailStr
    mobile: str = ""
    address: str = ""
    loan_type: str = Field(default="Personal Loan", alias="loanType")
    loan_amount: float = Field(gt=0, alias="loanAmount")
    loan_purpose: str = Field(default="", alias="loanPurpose")
    tenure: int = Field(default=12, ge=1, le=360)
    calculated_emi: float = Field(default=0.0, alias="calculatedEmi")

    @field_validator("full_name", "loan_purpose")
    @classmethod
    def non_empty_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("field cannot be empty")
        return value


class ApplicationResponse(BaseModel):
    id: str
    pipeline_id: str
    status: str


class DocumentUploadResponse(BaseModel):
    pipeline_id: str
    filename: str
    doc_type: str
    status: str
    encrypted_path: str
