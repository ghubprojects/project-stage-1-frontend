export const DialogResources = {
    VI: {
        DeleteEmployee: {
            title: ' Xóa nhân viên',
            text: (employeeCode) => `Bạn có chắc chắn muốn xóa nhân viên <${employeeCode}> không?`,
        },
        DeleteMultipleEmployees: {
            title: 'Xóa danh sách nhân viên đã chọn?',
            text: 'Danh sách nhân viên sau khi xóa sẽ không thể khôi phục lại được.',
        },
        HideUpdatedEmployeeDetails: {
            title: 'Lưu thay đổi',
            text: 'Dữ liệu đã bị thay đổi. Bạn có muốn cất không?',
        },
        Validate: {
            title: 'Lỗi nhập liệu',
        },
        DuplicatedEmployeeCode: {
            title: 'Dữ liệu trùng lặp',
            text: (employeeCode) => `Mã nhân viên <${employeeCode}> đã tồn tại trong hệ thống, vui lòng kiểm tra lại.`,
        },
        GlobalError: {
            title: 'Lỗi',
        }
    },
    EN: {
        DeleteEmployee: {
            title: 'Delete Employee',
            text: (employeeCode) => `Are you sure you want to delete employee <${employeeCode}>?`,
        },
        DeleteMultipleEmployees: {
            title: 'Delete Selected Employees?',
            text: 'The selected employees will be permanently deleted.',
        },
        HideUpdatedEmployeeDetails: {
            title: 'Save Changes',
            text: 'Data has been changed. Do you want to store?',
        },
        Validate: {
            title: 'Input Error',
        },
        DuplicatedEmployeeCode: {
            title: 'Duplicate Data',
            text: (employeeCode) => `Employee code <${employeeCode}> already exists in the system. Please check again.`,
        },
        GlobalError: {
            title: 'Error',
        }
    }
}