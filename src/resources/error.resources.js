export const ErrorResources = {
    VI: {
        ConnectionError: "Có lỗi xảy ra. Vui lòng liên hệ MISA để được hỗ trợ.",

        // fields
        EmptyEmployeeCode: 'Mã không được để trống',
        OverflowEmployeeCode: 'Mã không được vượt quá 20 kí tự',

        EmptyFullName: 'Tên không được để trống',
        OverflowFullName: 'Tên không được vượt quá 100 kí tự',

        EmptyDepartment: 'Đơn vị không được để trống',
        InvalidDepartment: 'Dữ liệu Đơn vị không có trong danh mục',

        OverflowPositionName: 'Chức danh không được vượt quá 100 kí tự',

        InvalidDateOfBirth: 'Ngày sinh không hợp lệ',
        DateOfBirthGreaterNow: 'Ngày sinh không được lớn hơn ngày hiện tại',

        OverflowIdentityNumber: 'Số căn cước công dân không được vượt quá 25 kí tự',

        InvalidIdentityIssuedDate: 'Ngày cấp không hợp lệ',
        IdentityIssuedDateGreaterNow: 'Ngày cấp không được lớn hơn ngày hiện tại',

        OverflowEmail: 'Email không được vượt quá 100 kí tự',
        InvalidEmail: 'Email không hợp lệ',

        OverflowIdentityIssuedPlace: 'Nơi cấp căn cước công dân không được vượt quá 255 kí tự',
        OverflowAddress: 'Địa chỉ không được vượt quá 255 kí tự',
        OverflowMobilePhone: 'Số điện thoại di động không được vượt quá 50 kí tự',
        OverflowLandlinePhone: 'Số điện thoại cố định không được vượt quá 50 kí tự',
        OverflowBankAccount: 'Tài khoản ngân hàng không được vượt quá 25 kí tự',
        OverflowBankName: 'Tên ngân hàng không được vượt quá 255 kí tự',
        OverflowBankBranch: 'Chi nhánh ngân hàng không được vượt quá 255 kí tự',
    },
    EN: {
        ConnectionError: "An error has occurred. Please contact MISA for assistance.",

        // fields
        EmptyEmployeeCode: 'Code cannot be empty',
        OverflowEmployeeCode: 'Code cannot exceed 20 characters',

        EmptyFullName: 'Name cannot be empty',
        OverflowFullName: 'Fullname cannot exceed 100 characters',

        EmptyDepartment: 'Department cannot be empty',
        InvalidDepartment: 'Department data not found in the directory',

        OverflowPositionName: 'Position cannot exceed 100 characters',

        InvalidDateOfBirth: 'Invalid date of birth',
        DateOfBirthGreaterNow: 'Date of birth cannot be greater than the current date',

        OverflowIdentityNumber: 'Identity number cannot exceed 25 characters',

        InvalidIdentityIssuedDate: 'Invalid identity issued date',
        IdentityIssuedDateGreaterNow: 'Identity issued date cannot be greater than the current date',

        OverflowEmail: 'Email cannot exceed 100 characters',
        InvalidEmail: 'Email is invalid',

        OverflowIdentityIssuedPlace: 'Identity issued place cannot exceed 255 characters',
        OverflowAddress: 'Address cannot exceed 255 characters',
        OverflowMobilePhone: 'Mobile phone number cannot exceed 50 characters',
        OverflowLandlinePhone: 'Landline phone number cannot exceed 50 characters',
        OverflowBankAccount: 'Bank account cannot exceed 25 characters',
        OverflowBankName: 'Bank name cannot exceed 255 characters',
        OverflowBankBranch: 'Bank branch cannot exceed 255 characters',
    }
}