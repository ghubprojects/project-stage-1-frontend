<script setup>
import { ref, useSlots } from 'vue';

import { IconClose, IconHelp } from '@/assets/icons';
import {
    VButton,
    VCheckbox,
    VCombobox,
    VDateField,
    VDialog,
    VRadioButton,
    VRadioField,
    VTextField
} from '@/components';

import {
    useDepartmentStore,
    useDialogStore,
    useEmployeeStore,
    useErrorStore,
    useLanguageStore,
    useTableStore,
    useToastMessageStore
} from '@/stores';

import {
    ButtonResources,
    DialogResources,
    ErrorResources,
    FieldResources,
    TableResources,
    ToastMessageResources
} from '@/resources';
import * as dataHandler from '@/utils/datahandler';
import { getEmployeeFromDto } from '@/utils/datahandler';
import { DialogName, EmployeeFields, FormMode, Gender, ToastMessageType } from '@/utils/enum';

// global states
const Error = useErrorStore();
const Language = useLanguageStore();
const Dialog = useDialogStore();
const ToastMessage = useToastMessageStore();

const Table = useTableStore();
const Employee = useEmployeeStore();
const Department = useDepartmentStore();

const slots = useSlots();

/**
 * Tự động sinh mã nhân viên khi thêm nhân viên mới
 * @returns mã nhân viên mới
 * Created by: ttanh (27/09/2023)
 */
const generateEmployeeCode = () => {
    const pattern = 'NV-';
    const sortedListCode = Employee.listAll
        .map((emp) => emp.EmployeeCode)
        .sort(
            (code, anotherCode) => code.slice(pattern.length) - anotherCode.slice(pattern.length)
        );
    const lastCode = sortedListCode[sortedListCode.length - 1].slice(pattern.length);
    const newEmployeeCode = `${pattern}${parseInt(lastCode) + 1}`;
    return newEmployeeCode;
};

// Lưu dữ liệu nhân viên hiện tại vào biến details
const details = ref(
    Employee.formMode === FormMode.Duplicate
        ? getEmployeeFromDto({
              ...Employee.current,
              [EmployeeFields.EmployeeCode]: generateEmployeeCode()
          })
        : Employee.formMode === FormMode.Create
        ? { ...Employee.initFields, [EmployeeFields.EmployeeCode]: generateEmployeeCode() }
        : getEmployeeFromDto({ ...Employee.current })
);

console.log(Employee.formMode, details.value);

/**
 * === SỬA DỮ LIỆU NHÂN VIÊN ===
 */

/**
 * Cập nhật input được sửa vào object details
 * @param {event} event
 * @param {string} property
 * Created by: ttanh (20/08/2023)
 * Modified by: ttanh (21/08/2023)
 */
// đối với text field
const handleInput = (event, property) => {
    details.value[property] = event.target.value;
};

// đổi với radio field
const handleCheckRadio = (event, property) => {
    details.value[property] = Number(event);
};

// đối với date picker
const handlePickDate = (event, property) => {
    details.value[property] = event;
};

/**
 * === XỬ LÝ NHẬP LIỆU COMBOBOX DEPARTMENT ===
 */

const isSearchingDepartment = ref(false);

/**
 * Khi input thay đổi, thực hiện tìm kiếm option
 * @param {event} event
 * Created by: ttanh (25/08/2023)
 * Modified by: ttanh (27/09/2023)
 */
const handleInputOption = async (event) => {
    isSearchingDepartment.value = true;
    await Department.getFilteringAsync(event.target.value);
};

/**
 * Khi lựa chọn đơn vị, cập nhật details
 * @param {string} item tên đơn vị
 * Created by: ttanh (25/08/2023)
 * Modified by: ttanh (27/09/2023)
 */
const handleSelectDepartment = async (item) => {
    isSearchingDepartment.value = false;
    const result = await Department.getByNameAsync(item);
    if (result.Succeeded && result.Data.length === 1) {
        Department.current = result.Data[0];
        details.value[EmployeeFields.DepartmentID] = Department.current.DepartmentID;
        details.value[EmployeeFields.DepartmentName] = Department.current.DepartmentName;
    }
};

const isUpdated = ref(false);

/**
 * === XỬ LÝ VALIDATE INPUT ===
 */

// lưu trữ danh sách lỗi input
const inputErrorList = ref(new Set());

/**
 * thêm thông báo lỗi vào inputErrorList
 * @param {object} errObj
 * Created by: ttanh (22/08/2023)
 * Modified by: ttanh (05/10/2023)
 */
const addError = (errObj) => {
    inputErrorList.value.add(errObj);
    console.log('add error done', errObj.id, Array.from(inputErrorList.value));
};

/**
 * loại bỏ thông báo lỗi khỏi inputErrorList
 * @param {string} idField
 * Created by: ttanh (22/08/2023)
 * Modified by: ttanh (05/10/2023)
 */
const removeError = (idField) => {
    for (const entry of inputErrorList.value.values()) {
        if (entry.id === idField) inputErrorList.value.delete(entry);
    }
    console.log('remove error', idField, Array.from(inputErrorList.value));
};

/**
 * ẩn form khi click vào close icon
 * 1. thực hiện so sánh dữ liệu trên form và dữ liệu gốc của nhân viên hiện tại
 * 2. nếu khác nhau, hiển thị Dialog xác nhận lưu thay đổi
 * 3. nếu không, ẩn form chi tiết
 * Created by: ttanh (22/08/2023)
 * Modified by: ttanh (23/08/2023)
 */
const handleHideForm = () => {
    console.log('handleHideForm');
    console.log('details:', details.value);
    console.log('Employee.current:', Employee.current);

    if (
        JSON.stringify(details.value) !==
        JSON.stringify(dataHandler.getEmployeeFromDto(Employee.current))
    ) {
        isUpdated.value = true;
        Dialog.show(DialogName.HideUpdatedEmployeeDetails);
    } else {
        Employee.form.hide();
    }
};

const isShowValidateDialog = ref(false);

// thực hiện validate form và hiển thị Dialog Validate
const showValidateDialog = () => {
    isShowValidateDialog.value = true;
    Dialog.show(DialogName.Validate);
};

/**
 * Thực hiện thêm nhân viên:
 * - hiển thị validate dialog (nếu có)
 * - nếu không có thông báo lỗi khi validate, thực hiện thêm nhân viên
 *   - nếu mã nhân viên chưa tồn tại, thêm nhân viên đó, thông báo thành công và đóng form
 *   - ngược lại, hiển thị dialog thông báo mã nhân viên trùng lặp
 * - nếu gặp exception, gửi message lỗi
 * Created by: ttanh (03/08/2023)
 */
const handleAddEmployee = async () => {
    try {
        showValidateDialog();
        if (!inputErrorList.value.size) {
            console.log(dataHandler.getCreateDtoFromEmployee(details.value));
            const result = await Employee.addAsync(
                dataHandler.getCreateDtoFromEmployee(details.value)
            );

            // check affected rows is 1
            if (result.Succeeded && result.Data === 1) {
                await Employee.getPaginationAsync(Table.recordPerPage, Table.offsetValue);
                ToastMessage.show(
                    ToastMessageType.Success,
                    ToastMessageResources[Language.current].AddEmployee.success(
                        details.value.EmployeeCode
                    )
                );
                Employee.form.hide();
                Employee.checklist = [];
            }
        }
    } catch (err) {
        console.log(err);
        ToastMessage.show(
            ToastMessageType.Error,
            ToastMessageResources[Language.current].AddEmployee.error
        );
    }
};

/**
 * Thực hiện cập nhật nhân viên
 * - hiển thị validate dialog (nếu có)
 * - nếu không có thông báo lỗi khi validate, thực hiện cập nhật nhân viên
 *   - nếu mã nhân viên chưa tồn tại, cập nhật nhân viên đó, thông báo thành công và đóng form
 *   - ngược lại, hiển thị dialog thông báo mã nhân viên trùng lặp
 * - nếu gặp exception, gửi message lỗi
 * Created by: ttanh (03/08/2023)
 * Modified by: ttanh (26/09/2023)
 */
const handleUpdateEmployee = async () => {
    try {
        details.value.CurrentEmployeeCode = Employee.current.EmployeeCode;
        showValidateDialog();
        if (!inputErrorList.value.size) {
            console.log(dataHandler.getUpdateDtoFromEmployee(details.value));
            const result = await Employee.updateAsync(
                dataHandler.getUpdateDtoFromEmployee(details.value)
            );

            // check affected rows is 1
            if (result.Succeeded && result.Data === 1) {
                await Employee.getPaginationAsync(Table.recordPerPage, Table.offsetValue);
                ToastMessage.show(
                    ToastMessageType.Success,
                    ToastMessageResources[Language.current].UpdateEmployee.success(
                        Employee.current.EmployeeCode
                    )
                );
                isUpdated.value = false;
                Employee.form.hide();
                Employee.checklist = [];
            }
        }
    } catch (err) {
        console.log(err);
        isUpdated.value = false;

        ToastMessage.show(
            ToastMessageType.Error,
            ToastMessageResources[Language.current].UpdateEmployee.error(
                Employee.current.EmployeeCode
            )
        );
    }
};

/**
 * Thực hiện cất form:
 * - nếu Employee.formMode là Create, thêm nhân viên
 * - ngược lại, cập nhật nhân viên
 * Created by: ttanh (03/08/2023)
 */
const handleStoreForm = async () => {
    if (Employee.formMode === FormMode.Create || Employee.formMode === FormMode.Duplicate)
        await handleAddEmployee();
    else if (Employee.formMode === FormMode.Update) await handleUpdateEmployee();
    else Error.setCurrent('Không thể cất dữ liệu');
};

/**
 * Force rerender cho component khi language thay đổi
 * Created by: ttanh (05/10/2023)
 */
// Tạo key cho employeeForm
const employeeFormKey = ref(0);

// Force rerender bằng cách cập nhật giá trị cho employeeFormKey
const forceRerender = () => {
    employeeFormKey.value += 1;
};

// ẩn Dialog Validate khi click vào nút Đóng của Dialog Validate
const hideValidateDialog = () => {
    isShowValidateDialog.value = false;
    Dialog.hide();
    Array.from(inputErrorList.value)[0].focus = true;
    console.log(details.value);
    forceRerender();
    console.log(details.value);

    console.log(Array.from(inputErrorList.value)[0]);
};

/**
 * Focus vào input lỗi khi đóng Dialog
 * @param {string} idField
 */
const isFirstFocus = (idField) => {
    return Boolean(
        Array.from(inputErrorList.value).length &&
            Array.from(inputErrorList.value)[0].id === idField &&
            Array.from(inputErrorList.value)[0].focus
    );
};

// hủy cập nhật dữ liệu nhân viên và đóng form khi click vào nút hủy
const cancelUpdateForm = () => {
    details.value = {};
    isUpdated.value = false;
    Employee.form.hide();
};

/**
 * Cất và tạo mới form
 * Created by: ttanh (28/08/2023)
 * Modified by: ttanh (29/08/2023)
 */
const handleStoreAndCreateForm = async () => {
    try {
        await handleStoreForm();
        Employee.form.create();
    } catch (err) {
        console.log(err);
    }
};

/**
 * === XỬ LÝ PHÍM TẮT ===
 */

/**
 * Khi ấn phím CTRL F8, thực hiện lưu và cất form
 * Khi ấn phím CTRL F9, thực hiện hủy và đóng form
 * @param {event} event
 * Created by: ttanh (02/10/2023)
 */
const handleKeyDownForm = async (event) => {
    if (event.ctrlKey && event.code === 'F8') {
        event.preventDefault();
        await handleStoreForm();
    } else if (event.shiftKey && event.code === 'F8') {
        event.preventDefault();
        await handleStoreAndCreateForm();
    } else if (event.ctrlKey && event.code === 'F9') {
        event.preventDefault();
        Employee.form.hide();
    }
};
</script>

<template>
    <div
        class="form"
        @keydown.esc="handleHideForm"
        @keydown.stop="handleKeyDownForm"
        :key="employeeFormKey"
    >
        <div class="form-container">
            <!-- form header -->
            <div class="form-header">
                <!-- form-header left-group -->
                <div class="left-group">
                    <div class="heading-1 heading">
                        {{ TableResources[Language.current].EmployeeForm }}
                    </div>
                    <VCheckbox
                        id="customer-checkbox"
                        :label="TableResources[Language.current].CustomerCheckbox"
                    />
                    <VCheckbox
                        id="provider-checkbox"
                        :label="TableResources[Language.current].SupplierCheckbox"
                    />
                </div>

                <!-- form-header right-group -->
                <div class="right-group">
                    <IconHelp class="help-icon" />
                    <slot v-if="slots.closeIcon"></slot>
                    <IconClose
                        v-else
                        class="close-icon"
                        :title="ButtonResources[Language.current].CloseTooltip"
                        @click="handleHideForm"
                    />
                </div>

                <!-- hide updated employee details dialog -->
                <VDialog
                    v-if="isUpdated && Dialog.current === DialogName.HideUpdatedEmployeeDetails"
                    :data="DialogResources[Language.current].HideUpdatedEmployeeDetails"
                    :primary-text="ButtonResources[Language.current].Store"
                    :secondary-text="ButtonResources[Language.current].Cancel"
                    @handle-primary="handleStoreForm"
                    @handle-secondary="cancelUpdateForm"
                />
            </div>

            <!-- form content -->
            <div class="form-content">
                <div class="group-1">
                    <div class="left-group">
                        <div style="display: flex; gap: 8px">
                            <VTextField
                                size="small"
                                width="medium"
                                :id="EmployeeFields.EmployeeCode"
                                :label="FieldResources[Language.current].EmployeeCode"
                                :value="details.EmployeeCode"
                                @input="handleInput($event, EmployeeFields.EmployeeCode)"
                                :max-length="20"
                                :first-focus="isFirstFocus(EmployeeFields.EmployeeCode)"
                                required
                                :show-error="Boolean(Array.from(inputErrorList).length)"
                                @add-error-message="addError"
                                @remove-error-message="removeError"
                                :err-msgs="{
                                    isEmpty: ErrorResources[Language.current].EmptyEmployeeCode,
                                    isOverflow:
                                        ErrorResources[Language.current].OverflowEmployeeCode
                                }"
                            />

                            <VTextField
                                size="small"
                                width="large"
                                :id="EmployeeFields.FullName"
                                :label="FieldResources[Language.current].FullName"
                                :value="details.FullName"
                                @input="handleInput($event, EmployeeFields.FullName)"
                                :max-length="100"
                                required
                                :first-focus="isFirstFocus(EmployeeFields.FullName)"
                                :show-error="Boolean(Array.from(inputErrorList).length)"
                                @add-error-message="addError"
                                @remove-error-message="removeError"
                                :err-msgs="{
                                    isEmpty: ErrorResources[Language.current].EmptyFullName,
                                    isOverflow: ErrorResources[Language.current].OverflowFullName
                                }"
                            />
                        </div>

                        <VCombobox
                            required
                            size="small"
                            width="full"
                            :id="EmployeeFields.DepartmentName"
                            :label="FieldResources[Language.current].DepartmentName"
                            :itemList="
                                isSearchingDepartment ? Department.listName : Department.listAllName
                            "
                            :data="Department.listAllName"
                            :value="details.DepartmentName"
                            @input="handleInputOption($event)"
                            @select-item="handleSelectDepartment"
                            :first-focus="isFirstFocus(EmployeeFields.DepartmentName)"
                            :show-error="Boolean(Array.from(inputErrorList).length)"
                            @add-error-message="addError"
                            @remove-error-message="removeError"
                            :err-msgs="{
                                isEmpty: ErrorResources[Language.current].EmptyDepartment,
                                isInvalid: ErrorResources[Language.current].InvalidDepartment
                            }"
                        />

                        <VTextField
                            size="small"
                            width="full"
                            :id="EmployeeFields.PositionName"
                            :label="FieldResources[Language.current].PositionName"
                            :value="details.PositionName"
                            @input="handleInput($event, EmployeeFields.PositionName)"
                            :max-length="100"
                            :err-msgs="{
                                isOverflow: ErrorResources[Language.current].OverflowPositionName
                            }"
                        />
                    </div>

                    <!-- Form group 2 -->
                    <div class="right-group">
                        <div style="display: flex; justify-content: space-between; gap: 8px">
                            <VDateField
                                size="small"
                                width="large"
                                :id="EmployeeFields.DateOfBirth"
                                :label="FieldResources[Language.current].DateOfBirth"
                                :value="details.DateOfBirth"
                                @update:input="handlePickDate($event, EmployeeFields.DateOfBirth)"
                                :first-focus="isFirstFocus(EmployeeFields.DateOfBirth)"
                                :show-error="Boolean(Array.from(inputErrorList).length)"
                                @add-error-message="addError"
                                @remove-error-message="removeError"
                                :err-msgs="{
                                    isInvalid: ErrorResources[Language.current].InvalidDateOfBirth,
                                    isGreaterNow:
                                        ErrorResources[Language.current].DateOfBirthGreaterNow
                                }"
                            />

                            <VRadioField
                                width="large"
                                :default-value="Gender.Male"
                                :legend="FieldResources[Language.current].Gender"
                            >
                                <template #input-group>
                                    <VRadioButton
                                        id="male"
                                        name="gender"
                                        :label="FieldResources[Language.current].GenderMale"
                                        :value="Gender.Male"
                                        :checked="details.Gender === Gender.Male"
                                        @check-radio="handleCheckRadio($event, 'Gender')"
                                    />

                                    <VRadioButton
                                        id="female"
                                        name="gender"
                                        :label="FieldResources[Language.current].GenderFemale"
                                        :value="Gender.Female"
                                        :checked="details.Gender === Gender.Female"
                                        @check-radio="handleCheckRadio($event, 'Gender')"
                                    />

                                    <VRadioButton
                                        id="other"
                                        name="gender"
                                        :label="FieldResources[Language.current].GenderOther"
                                        :value="Gender.Other"
                                        :checked="details.Gender === Gender.Other"
                                        @check-radio="handleCheckRadio($event, 'Gender')"
                                    />
                                </template>
                            </VRadioField>
                        </div>

                        <div style="display: flex; gap: 8px">
                            <VTextField
                                size="small"
                                width="large"
                                :id="EmployeeFields.IdentityNumber"
                                :label="FieldResources[Language.current].IdentityNumber"
                                :title="FieldResources[Language.current].IdentityNumberTitle"
                                :value="details.IdentityNumber"
                                @input="handleInput($event, EmployeeFields.IdentityNumber)"
                                :max-length="25"
                                :err-msgs="{
                                    isOverflow:
                                        ErrorResources[Language.current].OverflowIdentityNumber
                                }"
                            />

                            <VDateField
                                size="small"
                                width="large"
                                :id="EmployeeFields.IdentityIssuedDate"
                                :label="FieldResources[Language.current].IdentityIssuedDate"
                                :value="details.IdentityIssuedDate"
                                @update:input="
                                    handlePickDate($event, EmployeeFields.IdentityIssuedDate)
                                "
                                :first-focus="isFirstFocus(EmployeeFields.IdentityIssuedDate)"
                                :show-error="Boolean(Array.from(inputErrorList).length)"
                                @add-error-message="addError"
                                @remove-error-message="removeError"
                                :err-msgs="{
                                    isInvalid:
                                        ErrorResources[Language.current].InvalidIdentityIssuedDate,
                                    isGreaterNow:
                                        ErrorResources[Language.current]
                                            .IdentityIssuedDateGreaterNow
                                }"
                            />
                        </div>

                        <VTextField
                            size="small"
                            width="full"
                            :id="EmployeeFields.IdentityIssuedPlace"
                            :label="FieldResources[Language.current].IdentityIssuedPlace"
                            :value="details.IdentityIssuedPlace"
                            @input="handleInput($event, EmployeeFields.IdentityIssuedPlace)"
                            :max-length="255"
                            :err-msgs="{
                                isOverflow:
                                    ErrorResources[Language.current].OverflowIdentityIssuedPlace
                            }"
                        />
                    </div>
                </div>

                <VTextField
                    size="small"
                    width="full"
                    :id="EmployeeFields.Address"
                    :label="FieldResources[Language.current].Address"
                    style="margin-top: 24px"
                    :value="details.Address"
                    @input="handleInput($event, EmployeeFields.Address)"
                    :max-length="255"
                    :err-msgs="{
                        isOverflow: ErrorResources[Language.current].OverflowAddress
                    }"
                />

                <div class="group-2">
                    <div class="first-line">
                        <VTextField
                            size="small"
                            width="large"
                            :id="EmployeeFields.MobilePhone"
                            :label="FieldResources[Language.current].MobilePhone"
                            :title="FieldResources[Language.current].MobilePhoneTitle"
                            :value="details.MobilePhone"
                            @input="handleInput($event, EmployeeFields.MobilePhone)"
                            :max-length="50"
                            :err-msgs="{
                                isOverflow: ErrorResources[Language.current].OverflowMobilePhone
                            }"
                        />

                        <VTextField
                            size="small"
                            width="large"
                            :id="EmployeeFields.LandlinePhone"
                            :label="FieldResources[Language.current].LandlinePhone"
                            :title="FieldResources[Language.current].LandlinePhoneTitle"
                            :value="details.LandlinePhone"
                            @input="handleInput($event, EmployeeFields.LandlinePhone)"
                            :max-length="50"
                            :err-msgs="{
                                isOverflow: ErrorResources[Language.current].OverflowLandlinePhone
                            }"
                        />

                        <VTextField
                            size="small"
                            width="large"
                            :id="EmployeeFields.Email"
                            :label="FieldResources[Language.current].Email"
                            :value="details.Email"
                            @input="handleInput($event, EmployeeFields.Email)"
                            :max-length="100"
                            :pattern="/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/"
                            :err-msgs="{
                                isInvalid: ErrorResources[Language.current].InvalidEmail,
                                isOverflow: ErrorResources[Language.current].OverflowEmail
                            }"
                        />
                    </div>

                    <div class="second-line">
                        <VTextField
                            size="small"
                            width="large"
                            :id="EmployeeFields.BankAccount"
                            :label="FieldResources[Language.current].BankAccount"
                            :value="details.BankAccount"
                            @input="handleInput($event, EmployeeFields.BankAccount)"
                            :max-length="25"
                            :err-msgs="{
                                isOverflow: ErrorResources[Language.current].OverflowBankAccount
                            }"
                        />

                        <VTextField
                            size="small"
                            width="large"
                            :id="EmployeeFields.BankName"
                            :label="FieldResources[Language.current].BankName"
                            :value="details.BankName"
                            @input="handleInput($event, EmployeeFields.BankName)"
                            :max-length="255"
                            :err-msgs="{
                                isOverflow: ErrorResources[Language.current].OverflowBankName
                            }"
                        />

                        <VTextField
                            size="small"
                            width="large"
                            :id="EmployeeFields.BankBranch"
                            :label="FieldResources[Language.current].BankBranch"
                            :value="details.BankBranch"
                            @input="handleInput($event, EmployeeFields.BankBranch)"
                            :max-length="255"
                            :err-msgs="{
                                isOverflow: ErrorResources[Language.current].OverflowBankBranch
                            }"
                        />
                    </div>
                </div>
            </div>

            <div class="form-footer">
                <div class="left-group">
                    <VButton
                        type="outline"
                        class="cancel-btn"
                        :title="ButtonResources[Language.current].CancelTooltip"
                        @click="Employee.form.hide"
                    >
                        {{ ButtonResources[Language.current].Cancel }}
                    </VButton>
                </div>

                <div class="right-group">
                    <VButton
                        type="outline"
                        class="add-btn"
                        :title="ButtonResources[Language.current].StoreTooltip"
                        @click="handleStoreForm"
                    >
                        {{ ButtonResources[Language.current].Store }}
                    </VButton>
                    <VButton
                        type="primary"
                        class="add-more-btn"
                        :title="ButtonResources[Language.current].StoreAndAddTooltip"
                        @click="handleStoreAndCreateForm"
                        @keydown.tab="forceRerender"
                    >
                        {{ ButtonResources[Language.current].StoreAndAdd }}
                    </VButton>
                </div>
            </div>

            <!-- Validate dialog -->
            <VDialog
                v-if="
                    isShowValidateDialog &&
                    Dialog.current === DialogName.Validate &&
                    inputErrorList.size
                "
                :title="DialogResources[Language.current].Validate.title"
                :text="Array.from(inputErrorList)[0].message"
                :primary-text="ButtonResources[Language.current].Close"
                @handle-primary="hideValidateDialog"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
.form {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;
    background-color: rgb(var(--c-black), 0.4);
}

.form-container {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    background-color: rgb(var(--c-white));
}

/* Styles for form-header */
.form-header {
    @include font(14);
    margin-top: 24px;
    padding: 0 24px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    .left-group {
        display: flex;
        gap: 24px;
        .heading {
            margin-right: 6px;
        }
    }
    .right-group {
        display: flex;
        gap: 8px;
        .help-icon,
        .close-icon {
            @include size(24px);
            cursor: pointer;
        }
    }
}

/* Styles for form-content */
.form-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    .group-1 {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        .left-group,
        .right-group {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
    }
    .group-2 {
        display: flex;
        flex-direction: column;
        gap: 16px;
        .first-line,
        .second-line {
            display: flex;
            gap: 8px;
        }
    }
}

/* Styles for form-footer */
.form-footer {
    display: flex;
    justify-content: space-between;
    padding: 12px 24px;
    border-radius: 0 0 4px 4px;

    background-color: rgb(var(--c-gray-100));
    border-top: 1px solid rgb(var(--c-gray-300));
    .right-group {
        display: flex;
        gap: 8px;
    }
}
</style>
