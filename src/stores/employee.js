import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

import * as EmployeeService from '@/services/employee';
import { EmployeeFields, FormMode } from '@/utils/enum';
import { useErrorStore } from './error';

/**
 * Tạo 1 empty object để lưu trữ các trường dữ liệu nhân viên
 * @returns Đối tượng trống lưu trữ các trường của nhân viên
 * Created by: ttanh (25/08/2023)
 * Modified by: ttanh (04/09/2023)
 */
const getEmptyData = () => {
    const emptyObject = {}
    for (const key in EmployeeFields) emptyObject[key] = ''
    return emptyObject
};

/**
 * Store quản lý trạng thái nhân viên
 * Created by: ttanh (20/08/2023)
 */
export const useEmployeeStore = defineStore('employeeState', () => {
    const initFields = getEmptyData()

    const current = ref(initFields)
    const list = ref([])
    const listAll = ref([])

    const isLoading = ref(false);
    const isSearching = ref(false);

    /**
     * lấy dữ liệu danh sách nhân viên phân trang
     * @param {int} limit Số bản ghi mỗi trang
     * @param {int} offset Hàng bắt đầu truy xuất
     * Created by: ttanh (29/08/2023)
     * Modified by: ttanh (14/09/2023)
     */
    const getPaginationAsync = async (limit, offset) => {
        try {
            await EmployeeService.getAllAsync().then(res => {
                listAll.value = res.data.Data
            })
            await EmployeeService.getPaginationAsync(limit, offset).then(res => {
                list.value = res.data.Data
            })
        } catch (err) {
            console.log(err);
            if (err instanceof AxiosError) {
                const Error = useErrorStore();
                Error.setCurrent(err)
            }
        }
    }

    /**
    * Lấy dữ liệu danh sách nhân viên phân trang và lọc theo mã nhân viên, tên nhân viên
    * @param {string} keyword Mã nhân viên hoặc tên nhân viên tìm kiếm
    * @param {int} limit Số bản ghi mỗi trang
    * @param {int} offset Hàng bắt đầu truy xuất
    * Created by: ttanh (29/08/2023)
    * Modified by: ttanh (14/09/2023)
    */
    const getFilteringAndPaginationAsync = async (keyword, limit, offset) => {
        try {
            await EmployeeService.getFilteringAsync(keyword).then(res => {
                listAll.value = res.data.Data
            })
            await EmployeeService.getFilteringAndPaginationAsync(keyword, limit, offset).then(res => {
                list.value = res.data.Data
            })
        } catch (err) {
            console.log(err);
            if (err instanceof AxiosError) {
                const Error = useErrorStore();
                Error.setCurrent(err)
            }
        }
    }

    /**
     * Lấy dữ liệu nhân viên theo ID
     * @param {string} id ID nhân viên
     * @returns Dữ liệu nhân viên
     * Created by: ttanh (29/08/2023)
     */
    const getByIdAsync = async (id) => {
        try {
            const response = await EmployeeService.getByIdAsync(id)
            return response.data
        } catch (err) {
            console.log(err);
            if (err instanceof AxiosError) {
                const Error = useErrorStore();
                Error.setCurrent(err)
            }
        }
    }

    /**
     * Thêm nhân viên
     * @param {object} data dữ liệu nhân viên mới 
     * Created by: ttanh (20/08/2023)
     * Modified by: ttanh (26/09/2023)
     */
    const addAsync = async (data) => {
        try {
            const response = await EmployeeService.addAsync(data)
            return response.data
        } catch (err) {
            console.log(err);
            if (err instanceof AxiosError) {
                const Error = useErrorStore();
                Error.setCurrent(err)
            }
        }
    };

    /**
     * Cập nhật thông tin nhân viên
     * @param {object} data dữ liệu nhân viên sau khi thay đổi
     * Created by: ttanh (20/08/2023)
     * Modified by: ttanh (21/09/2023)
     */
    const updateAsync = async (data) => {
        try {
            const response = await EmployeeService.updateAsync(data)
            return response.data
        } catch (err) {
            console.log(err);
            if (err instanceof AxiosError) {
                const Error = useErrorStore();
                Error.setCurrent(err)
            }
        }
    };

    /**
     * Xóa nhân viên theo id
     * @param {string} id ID nhân viên bị xóa
     * Created by: ttanh (20/08/2023)
     * Modified by: ttanh (10/09/2023)
     */
    const removeByIdAsync = async (id) => {
        try {
            const response = await EmployeeService.removeByIdAsync(id)
            return response.data
        } catch (err) {
            console.log(err);
            if (err instanceof AxiosError) {
                const Error = useErrorStore();
                Error.setCurrent(err)
            }
        }
    }

    /**
     * Xóa nhiều nhân viên theo ID
     * @param {array} idList Danh sách ID nhân viên bị xóa
     * Created by: ttanh (20/08/2023)
     */
    const removeMultipleAsync = async (idList) => {
        try {
            if (idList.length) {
                const response = await EmployeeService.removeMultipleAsync(idList);
                return response.data
            }
        } catch (err) {
            console.log(err);
            if (err instanceof AxiosError) {
                const Error = useErrorStore();
                Error.setCurrent(err)
            }
        }
    }

    /**
     * Quản lý form dữ liệu nhân viên
     * Created by: ttanh (20/08/2023)
     */
    const formMode = ref(FormMode.Hide)

    const form = reactive({
        // tạo form nhân viên mới
        create: () => {
            formMode.value = FormMode.Create
            current.value = initFields
        },

        // mở form nhân bản
        duplicate: (employee) => {
            formMode.value = FormMode.Duplicate
            current.value = employee
        },

        // hiển thị thông tin nhân viên
        show: (employee) => {
            formMode.value = FormMode.Update
            current.value = employee
        },

        // ẩn thông tin nhân viên
        hide: () => {
            formMode.value = FormMode.Hide
            current.value = initFields;
        }
    })

    /**
     * Quản lý checklist nhân viên
     * Created by: ttanh (07/10/2023)
     */
    const checklist = ref([])

    /**
     * Kiểm tra xem nhân viên có được chọn không
     * @param {guid} employeeId ID nhân viên
     * @returns trạng thái check (true / false)
     * Created by: ttanh (07/10/2023)
     */
    const findCheck = (employeeId) =>
        checklist.value.find((checkitem) => checkitem.id === employeeId)

    /**
     * Lấy số nhân viên được chọn ở trang hiện tại
     * @param {int} currentPage trang hiện tại
     * @returns danh sách ID nhân viên được chọn
     * Created by: ttanh (07/10/2023)
     */
    const getPageCheck = (currentPage) =>
        checklist.value.filter((checkitem) => checkitem.page === currentPage)

    /**
     * Uncheck tất cả nhân viên ở trang hiện tại
     * @param {int} currentPage trang hiện tại
     * Created by: ttanh (07/10/2023)
     */
    const uncheckPage = (currentPage) =>
        checklist.value = checklist.value.filter(check => check.page !== currentPage)


    /**
     * Check tất cả nhân viên ở trang hiện tại
     * @param {int} currentPage trang hiện tại
     * Created by: ttanh (07/10/2023)
     */
    const checkPage = (currentPage) => {
        uncheckPage(currentPage);
        checklist.value.push(...list.value.map(employee =>
        ({
            id: employee[EmployeeFields.EmployeeID],
            page: currentPage
        })))
    }

    /**
    * Toggle check tất cả nhân viên ở trang hiện tại
    * @param {int} currentPage trang hiện tại
    * Created by: ttanh (07/10/2023)
    */
    const toggleCheckPage = (currentPage) => {
        if (getPageCheck(currentPage).length === list.value.length) uncheckPage(currentPage)
        else checkPage(currentPage)
    }

    /**
     * Lấy danh sách id tất cả nhân viên được chọn ở trang hiện tại
     * @param {int} currentPage trang hiện tại
     * @returns danh sách id tất cả nhân viên được chọn ở trang hiện tại
     * Created by: ttanh (07/10/2023)
     */
    const getPageCheckIds = (currentPage) => checklist.value.map(
        (checkitem) => (checkitem.page === currentPage && checkitem.id) ? checkitem.id : null)
        .filter(element => element !== null)

    /**
     * Xóa checkitem sau khi thực hiện xóa 1 nhân viên
     * @param {guid} employeeId ID nhân viên bị xóa
     * Created by: ttanh (08/10/2023)
     */
    const removeCheckById = (employeeId) => {
        checklist.value = checklist.value.filter((checkitem) => {
            if (checkitem.id !== employeeId) return checkitem;
        });
    }

    return {
        // biến lưu trữ
        initFields,
        current,
        list,
        listAll,
        isLoading,
        isSearching,

        // tương tác api nhân viên
        getPaginationAsync,
        getFilteringAndPaginationAsync,
        getByIdAsync,
        removeByIdAsync,
        addAsync,
        updateAsync,
        removeMultipleAsync,

        // quản lí form
        form,
        formMode,

        // quản lý checklist
        checklist,
        findCheck,
        getPageCheck,
        uncheckPage,
        checkPage,
        toggleCheckPage,
        getPageCheckIds,
        removeCheckById
    };
});
