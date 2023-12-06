export const ToastMessageResources = {
    VI: {
        Title: {
            success: 'Thành công!',
            error: 'Lỗi!',
            warning: 'Cảnh báo!',
            info: 'Thông tin!'
        },
        AddEmployee: {
            success: (employeeCode) => `Nhân viên <${employeeCode}> đã được thêm vào danh sách.`,
            error: 'Không thể thêm nhân viên vào danh sách.'
        },
        UpdateEmployee: {
            success: (employeeCode) => `Dữ liệu nhân viên <${employeeCode}> đã được cập nhật.`,
            error: (employeeCode) => `Không thể cập nhật dữ liệu nhân viên <${employeeCode}>.`
        },
        DeleteEmployee: {
            success: (employeeCode) => `Nhân viên <${employeeCode}> đã bị xóa.`,
            error: (employeeCode) => `Không thể xóa nhân viên <${employeeCode}>.`
        },
        DeleteMultipleEmployees: {
            success: 'Danh sách nhân viên đã chọn đã bị xóa.',
            error: 'Không thể xóa danh sách nhân viên đã chọn.'
        },
    },
    EN: {
        Title: {
            success: 'Success!',
            error: 'Error!',
            warning: 'Warning!',
            info: 'Information!'
        },
        AddEmployee: {
            success: (employeeCode) => `Employee <${employeeCode}> has been added to the list.`,
            error: 'Could not add employee to the list.'
        },
        UpdateEmployee: {
            success: (employeeCode) => `Employee data <${employeeCode}> has been updated.`,
            error: (employeeCode) => `Could not update employee data <${employeeCode}>.`,
        },
        DeleteEmployee: {
            success: (employeeCode) => `Employee <${employeeCode}> has been deleted.`,
            error: (employeeCode) => `Could not delete employee <${employeeCode}>.`,
        },
        DeleteMultipleEmployees: {
            success: 'Selected employees have been deleted.',
            error: 'Could not delete selected employees.',
        },
    }
}