import { EmployeeFields } from "@/utils/enum";

export const TableResources = {
    VI: {
        // Title
        Title: 'Nhân viên',
        Selected: 'Đã chọn',
        Unselect: 'Bỏ chọn',
        SelectAllPages: 'Chọn tất cả các trang',
        SearchEmployeePlaceholder: 'Tìm theo mã, tên nhân viên, số điện thoại',

        // Header
        [EmployeeFields.EmployeeCode]: 'Mã nhân viên',
        [EmployeeFields.FullName]: 'Tên nhân viên',
        [EmployeeFields.Gender]: 'Giới tính',
        [EmployeeFields.DateOfBirth]: 'Ngày sinh',
        [EmployeeFields.IdentityNumber]: 'Số cmnd',
        [EmployeeFields.PositionName]: 'Chức danh',
        [EmployeeFields.DepartmentName]: 'Tên đơn vị',
        [EmployeeFields.BankAccount]: 'Số tài khoản',
        [EmployeeFields.BankName]: 'Tên ngân hàng',
        [EmployeeFields.BankBranch]: 'Chi nhánh tk ngân hàng',
        Option: 'Chức năng',

        // Option
        Edit: 'Sửa',
        Duplicate: 'Nhân bản',
        Delete: 'Xóa',
        CeaseUsing: 'Ngừng sử dụng',

        // Pagination
        Total: 'Tổng số:',
        Record: 'bản ghi',
        RecordPerPage: 'bản ghi trên 1 trang',
        Previous: 'Trước',
        Next: 'Sau',

        // Form
        EmployeeForm: 'Thông tin nhân viên',
        CustomerCheckbox: 'Là khách hàng',
        SupplierCheckbox: 'Là nhà cung cấp'
    },
    EN: {
        // Title
        Title: 'Employee List',
        Selected: 'Selected',
        Unselect: 'Unselect',
        SelectAllPages: 'Select all pages',
        SearchEmployeePlaceholder: 'Search by code, name, phone number',

        // Header
        [EmployeeFields.EmployeeCode]: 'Employee code',
        [EmployeeFields.FullName]: 'Full name',
        [EmployeeFields.Gender]: 'Gender',
        [EmployeeFields.DateOfBirth]: 'Date of birth',
        [EmployeeFields.IdentityNumber]: 'Identity number',
        [EmployeeFields.PositionName]: 'Position name',
        [EmployeeFields.DepartmentName]: 'Department name',
        [EmployeeFields.BankAccount]: 'Bank account',
        [EmployeeFields.BankName]: 'Bank name',
        [EmployeeFields.BankBranch]: 'Bank branch',
        Option: 'Option',

        // Option
        Edit: 'Edit',
        Duplicate: 'Duplicate',
        Delete: 'Delete',
        CeaseUsing: 'Cease using',

        // Pagination
        Total: 'Total:',
        Record: 'record(s)',
        RecordPerPage: 'records per page',
        Previous: 'Previous',
        Next: 'Next',

        // Form
        EmployeeForm: "Employee's infomation",
        CustomerCheckbox: 'Is a customer',
        SupplierCheckbox: 'Is a supplier'
    }
}