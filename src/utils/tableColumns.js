import { VCheckbox } from '@/components';
export const tableColumns = [
    {
        name: 'employee-check',
        content: VCheckbox,
        width: 'extra-small',
    },
    {
        name: 'employee-code',
        header: 'mã nhân viên',
        property: 'EmployeeCode',
        width: 'medium',
    },
    {
        name: 'full-name',
        header: 'tên nhân viên',
        property: 'FullName',
        width: 'extra-large',
    },
    {
        name: 'gender',
        header: 'giới tính',
        property: 'Gender',
        width: 'small',
    },
    {
        name: 'date-of-birth',
        header: 'ngày sinh',
        property: 'DateOfBirth',
        width: 'medium',
    },
    {
        name: 'identity-number',
        header: 'số cmnd',
        property: 'IdentityNumber',
        width: 'medium',
        title: 'Số chứng minh nhân dân',
    },
    {
        name: 'position-name',
        header: 'chức danh',
        property: 'PositionName',
        width: 'large',
    },
    {
        name: 'department-name',
        header: 'tên đơn vị',
        property: 'DepartmentName',
        width: 'extra-large',
    },
    {
        name: 'bank-account',
        header: 'số tài khoản',
        property: 'BankAccount',
        width: 'medium',
    },
    {
        name: 'bank-name',
        header: 'tên ngân hàng',
        property: 'BankName',
        width: 'extra-large',
    },
    {
        name: 'bank-branch',
        header: 'chi nhánh tk ngân hàng',
        property: 'BankBranch',
        width: 'extra-large',
    },
];
