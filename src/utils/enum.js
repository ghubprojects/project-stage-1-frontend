/**
 * Enum giới tính (Nam: 0, Nữ: 1, Khác: 2)
 */
export const Gender = Object.freeze({
    Male: 0,
    Female: 1,
    Other: 2,
});

/**
 * Enum dialog
 */
export const DialogName = Object.freeze({
    DeleteEmployee: 'delete-employee',
    DeleteMultipleEmployees: 'delete-multiple-employees',
    HideUpdatedEmployeeDetails: 'hide-updated-employee-details',
    Validate: 'validate',
    DuplicatedEmployeeCode: 'duplicated-employee-code',
    GlobalError: 'global-error'
})

/**
 * Enum toast message (4 types: success, error, warning, info)
 */
export const ToastMessageType = Object.freeze({
    Success: 'success',
    Error: 'error',
    Warning: 'warning',
    Info: 'info'
})

/**
 * Enum các trường dữ liệu nhân viên
 */
export const EmployeeFields = Object.freeze({
    EmployeeID: "EmployeeID",
    EmployeeCode: "EmployeeCode",
    FullName: "FullName",
    DateOfBirth: "DateOfBirth",
    Gender: "Gender",
    IdentityNumber: "IdentityNumber",
    IdentityIssuedDate: "IdentityIssuedDate",
    IdentityIssuedPlace: "IdentityIssuedPlace",
    PositionName: "PositionName",
    DepartmentID: "DepartmentID",
    DepartmentName: "DepartmentName",
    Address: "Address",
    Email: "Email",
    MobilePhone: "MobilePhone",
    LandlinePhone: "LandlinePhone",
    BankAccount: "BankAccount",
    BankName: "BankName",
    BankBranch: "BankBranch",
})

/**
 * Enum các trường dữ liệu đơn vị
 */
export const DepartmentFields = Object.freeze({
    DepartmentID: "DepartmentID",
    DepartmentCode: "DepartmentCode",
    DepartmentName: "DepartmentName"
})

/**
 * Enum các chế độ form (create, update, duplicate)
 */
export const FormMode = Object.freeze({
    Create: 'Create',
    Update: 'Update',
    Duplicate: 'Duplicate',
    Hide: 'Hide'
})

/**
 * Enum ngôn ngữ
 */
export const LanguageList = Object.freeze({
    VI: 'VI',
    EN: 'EN'
})

/**
 * Enum menu item
 */
export const MenuItem = Object.freeze({
    DashBoard: 'DashBoard',
    Cash: 'Cash',
    Bank: 'Bank',
    Bag: 'Bag',
    Cart: 'Cart',
    Form: 'Form',
    Stock: 'Stock',
    Tools: 'Tools',
    FixedAssets: 'FixedAssets',
    Salary: 'Salary',
    Tax: 'Tax',
    Price: 'Price',
    Book: 'Book'
})

/**
 * Enum context menu in header
 */
export const HeaderContextMenu = Object.freeze({
    DateFormat: 'DateFormat',
    Language: 'Language'
})

/**
 * Enum Date format
 */
export const DateFormatList = Object.freeze({
    DMY: 'dd/mm/yyyy',
    MDY: 'mm/dd/yyyy',
    YMD: 'yyyy/mm/dd'
})