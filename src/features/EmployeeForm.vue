<script setup>
import { ref, useSlots } from 'vue';

import { IconClose, IconHelp } from '@/assets/icons';
import {
    VButton,
    VCheckbox,
    VDateField,
    VDialog,
    VRadioButton,
    VRadioField,
    VTextField
} from '@/components';

import { useDialogStore } from '@/stores/dialog';
import { useEmployeeStore } from '@/stores/employee';
import { useToastMessageStore } from '@/stores/toastMessage';

import { DialogName, Gender, ToastMessageType } from '@/utils/enums';
import { resources } from '@/utils/resources';

const Employee = useEmployeeStore();
const Dialog = useDialogStore();
const ToastMessage = useToastMessageStore();

const VNDialogResources = resources.VN.Dialog;
const ToastMessageResources = resources.VN.ToastMessage;

const slots = useSlots();

// lưu dữ liệu nhân viên hiện tại vào biến details
const details = ref(
    Employee.isShowNewDetails ? { ...Employee.initEmployeeFields } : { ...Employee.current }
);

/**
 * === CHỨC NĂNG SỬA DỮ LIỆU NHÂN VIÊN ===
 */

// cập nhật input được sửa vào object details
const handleInput = (event, property) => {
    details.value[property] = event.target.value;
};

// cập nhật input được sửa vào object details
const handleCheckRadio = (event, property) => {
    details.value[property] = Number(event);
};

// cập nhật input được sửa vào object details
const handlePickDate = (event, property) => {
    details.value[property] = event;
};

const isUpdated = ref(false);
const inputErrorList = ref(new Set());

// thêm thông báo lỗi vào inputErrorList
const addError = (errMsg) => {
    inputErrorList.value.add(errMsg);
};

// loại bỏ thông báo lỗi khỏi inputErrorList
const removeError = (errMsg) => {
    inputErrorList.value.delete(errMsg);
};

// ẩn form khi click vào close icon
const handleHideForm = () => {
    console.log('handleHideForm');
    console.log('details:', details.value);
    console.log('Employee.current:', Employee.current);
    // thực hiện so sánh dữ liệu trên form và dữ liệu gốc của nhân viên hiện tại
    // nếu khác nhau, hiển thị Dialog xác nhận lưu thay đổi
    // nếu không, ẩn form
    if (JSON.stringify(details.value) !== JSON.stringify(Employee.current)) {
        isUpdated.value = true;
        Dialog.show(DialogName.HideUpdatedEmployeeDetails);
    } else {
        Employee.hideDetails();
    }
};

const isShowValidateDialog = ref(false);

// thực hiện validate form và hiển thị Dialog Validate
const validateForm = () => {
    isShowValidateDialog.value = true;
    Dialog.show(DialogName.Validate);
};

// cập nhật danh sách nhân viên
const isDuplicatedEmployeeCode = ref(false);
const handleStoreForm = () => {
    // nếu Employee.isShowNewDetails là true, thêm nhân viên
    if (Employee.isShowNewDetails) {
        try {
            validateForm();
            // nếu không có thông báo lỗi khi validate, thực hiện thêm nhân viên,
            // thông báo thành công và đóng form
            if (!inputErrorList.value.size) {
                // nếu mã nhân viên chưa tồn tại, thêm nhân viên đó
                // ngược lại, hiển thị dialog thông báo mã nhân viên trùng lặp.
                if (Employee.getEmployeeByCode(details.value.EmployeeCode) === -1) {
                    // add
                    Employee.addEmployee(details.value);
                    ToastMessage.show(
                        ToastMessageType.Success,
                        ToastMessageResources.AddEmployee.success(details.value.EmployeeCode)
                    );
                    // hide
                    Employee.hideDetails();
                } else {
                    isDuplicatedEmployeeCode.value = true;
                    Dialog.show(DialogName.DuplicatedEmployeeCode);
                }
            }
        } catch (err) {
            // hide
            Employee.hideDetails();
            // nếu gặp lỗi, gửi message lỗi
            ToastMessage.show(ToastMessageType.Error, ToastMessageResources.AddEmployee.error);
            console.log(err);
        }
    } else {
        // nếu Employee.isShowNewDetails là false, thực hiện cập nhật nhân viên
        try {
            validateForm();
            // nếu không có thông báo lỗi khi validate, thực hiện cập nhật nhân viên,
            // thông báo thành công và đóng form
            if (!inputErrorList.value.size) {
                // nếu mã nhân viên chưa tồn tại, cập nhật nhân viên đó
                // ngược lại, hiển thị dialog thông báo mã nhân viên trùng lặp.
                if (Employee.getEmployeeByCode(details.value.EmployeeCode) === -1) {
                    // update
                    Employee.updateEmployee(Employee.current.EmployeeID, details.value);
                    ToastMessage.show(
                        ToastMessageType.Success,
                        ToastMessageResources.UpdateEmployee.success(
                            Employee.current.EmployeeCode
                        )
                    );
                    // hide
                    isUpdated.value = false;
                    Employee.hideDetails();
                } else if (details.value.EmployeeCode !== Employee.current.EmployeeCode) {
                    isDuplicatedEmployeeCode.value = true;
                    Dialog.show(DialogName.DuplicatedEmployeeCode);
                } else {
                    Employee.hideDetails();
                }
            }
        } catch (err) {
            // hide
            isUpdated.value = false;
            Employee.hideDetails();
            // nếu gặp lỗi, gửi message lỗi
            ToastMessage.show(
                ToastMessageType.Error,
                ToastMessageResources.UpdateEmployee.error(Employee.current.EmployeeCode)
            );
            console.log(err);
        }
    }
};

// ẩn Dialog Validate khi click vào nút Đóng của Dialog Validate
const hideValidateDialog = () => {
    isShowValidateDialog.value = false;
    Dialog.hide();
};

// ẩn Dialog Duplicated EmployeeCode khi click vào nút Đóng của Duplicated EmployeeCode
const hideDuplicatedEmployeeCodeDialog = () => {
    isDuplicatedEmployeeCode.value = false;
    Dialog.hide();
};

// hủy cập nhật dữ liệu nhân viên và đóng form khi click vào nút hủy
const cancelUpdateForm = () => {
    details.value = {};
    isUpdated.value = false;
    Employee.hideDetails();
};

// cất và tạo mới form
const handleStoreAndCreateForm = () => {
    try {
        handleStoreForm();
        setTimeout(() => {
            Employee.createDetails();
        }, 1);
    } catch (err) {
        console.log(err);
    }
};
</script>

<template>
    <div class="form">
        <div class="form-container">
            <!-- form header -->
            <div class="form-header">
                <!-- form-header left-group -->
                <div class="left-group">
                    <div class="heading-1 heading">Thông tin nhân viên</div>
                    <VCheckbox id="customer-checkbox" label="Là khách hàng" />
                    <VCheckbox id="provider-checkbox" label="Là nhà cung cấp" />
                </div>

                <!-- form-header right-group -->
                <div class="right-group">
                    <IconHelp class="help-icon" />
                    <slot v-if="slots.closeIcon"></slot>
                    <IconClose v-else class="close-icon" @click="handleHideForm" />
                </div>
                <!-- hide updated employee details dialog -->
                <VDialog
                    v-if="
                        isUpdated &&
                        Dialog.current.name === DialogName.HideUpdatedEmployeeDetails
                    "
                >
                    <template #title>
                        {{ VNDialogResources.HideUpdatedEmployeeDetails.title }}
                    </template>
                    <template #text>
                        {{ VNDialogResources.HideUpdatedEmployeeDetails.text }}
                    </template>
                    <template #primaryAction>
                        <VButton type="primary" colorScheme="red" @click="handleStoreForm">
                            {{ VNDialogResources.HideUpdatedEmployeeDetails.primaryAction }}
                        </VButton>
                    </template>
                    <template #secondaryAction>
                        <VButton type="outline" @click="cancelUpdateForm">
                            {{ VNDialogResources.HideUpdatedEmployeeDetails.secondaryAction }}
                        </VButton>
                    </template>
                </VDialog>
            </div>

            <!-- form content -->
            <div class="form-content">
                <div class="group-1">
                    <div class="left-group">
                        <div style="display: flex; gap: 8px">
                            <VTextField
                                size="small"
                                width="medium"
                                id="employee-code"
                                required
                                :value="details.EmployeeCode"
                                @input="handleInput($event, 'EmployeeCode')"
                                :errMsgs="{ isEmpty: `Mã không được để trống` }"
                                @add-error-message="addError"
                                @remove-error-message="removeError"
                                firstFocus
                            >
                                <template #label>Mã</template>
                            </VTextField>

                            <VTextField
                                size="small"
                                width="large"
                                id="full-name"
                                title="title"
                                required
                                :value="details.FullName"
                                @input="handleInput($event, 'FullName')"
                                :errMsgs="{ isEmpty: 'Tên không được để trống' }"
                                @add-error-message="addError"
                                @remove-error-message="removeError"
                            >
                                <template #label>Tên</template>
                            </VTextField>
                        </div>

                        <VTextField
                            size="small"
                            width="full"
                            id="department-name"
                            required
                            :value="details.DepartmentName"
                            @input="handleInput($event, 'DepartmentName')"
                            :errMsgs="{
                                isEmpty: `Đơn vị không được để trống`,
                                isInvalid: `Dữ liệu Đơn vị không có trong danh mục`
                            }"
                            @add-error-message="addError"
                            @remove-error-message="removeError"
                        >
                            <template #label>Đơn vị</template>
                        </VTextField>

                        <VTextField
                            size="small"
                            width="full"
                            id="position-name"
                            :value="details.PositionName"
                            @input="handleInput($event, 'PositionName')"
                        >
                            <template #label>Chức danh</template>
                        </VTextField>
                    </div>

                    <!-- Form group 2 -->
                    <div class="right-group">
                        <div style="display: flex; justify-content: space-between">
                            <VDateField
                                size="small"
                                id="date-of-birth"
                                :value="details.DateOfBirth"
                                @update:input="handlePickDate($event, 'DateOfBirth')"
                                :errMsgs="{
                                    isInvalid: `Ngày sinh không hợp lệ`
                                }"
                            >
                                <template #label>Ngày sinh</template>
                            </VDateField>

                            <VRadioField>
                                <template #legend>Giới tính</template>
                                <template #input-group>
                                    <VRadioButton
                                        id="male"
                                        name="gender"
                                        :value="Gender.Male"
                                        :checked="details.Gender === Gender.Male"
                                        @check-radio="handleCheckRadio($event, 'Gender')"
                                    >
                                        <template #label>Nam</template>
                                    </VRadioButton>

                                    <VRadioButton
                                        id="female"
                                        name="gender"
                                        :value="Gender.Female"
                                        :checked="details.Gender === Gender.Female"
                                        @check-radio="handleCheckRadio($event, 'Gender')"
                                    >
                                        >
                                        <template #label>Nữ</template>
                                    </VRadioButton>

                                    <VRadioButton
                                        id="other"
                                        name="gender"
                                        :value="Gender.Other"
                                        :checked="details.Gender === Gender.Other"
                                        @check-radio="handleCheckRadio($event, 'Gender')"
                                    >
                                        <template #label>Khác</template>
                                    </VRadioButton>
                                </template>
                            </VRadioField>
                        </div>

                        <div style="display: flex; gap: 8px">
                            <VTextField
                                size="small"
                                width="large"
                                id="identity-number"
                                title="Số chứng minh nhân dân"
                                :value="details.IdentityNumber"
                                @input="handleInput($event, 'IdentityNumber')"
                            >
                                <template #label>Số CMND</template>
                            </VTextField>

                            <VDateField
                                size="small"
                                id="date-of-issue"
                                :value="details.DateOfIssue"
                                @update:input="handlePickDate($event, 'DateOfIssue')"
                                :errMsgs="{
                                    isInvalid: `Ngày cấp không hợp lệ`
                                }"
                            >
                                <template #label>Ngày cấp</template>
                            </VDateField>
                        </div>

                        <VTextField
                            size="small"
                            width="full"
                            id="identity-department"
                            :value="details.PlaceOfIssue"
                            @input="handleInput($event, 'PlaceOfIssue')"
                        >
                            <template #label>Nơi cấp</template>
                        </VTextField>
                    </div>
                </div>

                <VTextField
                    size="small"
                    width="full"
                    id="address"
                    style="margin-top: 24px"
                    :value="details.Address"
                    @input="handleInput($event, 'Address')"
                >
                    <template #label>Địa chỉ</template>
                </VTextField>

                <div class="group-2">
                    <div class="first-line">
                        <VTextField
                            size="small"
                            width="large"
                            id="mobile-phone"
                            :value="details.MobilePhone"
                            @input="handleInput($event, 'MobilePhone')"
                        >
                            <template #label>ĐT di động</template>
                        </VTextField>

                        <VTextField
                            size="small"
                            width="large"
                            id="landline-phone"
                            :value="details.LandlinePhone"
                            @input="handleInput($event, 'LandlinePhone')"
                        >
                            <template #label>ĐT cố định</template>
                        </VTextField>

                        <VTextField
                            size="small"
                            width="large"
                            id="email"
                            :value="details.Email"
                            @input="handleInput($event, 'Email')"
                        >
                            <template #label>Email</template>
                        </VTextField>
                    </div>

                    <div class="second-line">
                        <VTextField
                            size="small"
                            width="large"
                            id="bank-account"
                            :value="details.BankAccount"
                            @input="handleInput($event, 'BankAccount')"
                        >
                            <template #label>Tài khoản ngân hàng</template>
                        </VTextField>

                        <VTextField
                            size="small"
                            width="large"
                            id="bank-name"
                            :value="details.BankName"
                            @input="handleInput($event, 'BankName')"
                        >
                            <template #label>Tên ngân hàng</template>
                        </VTextField>

                        <VTextField
                            size="small"
                            width="large"
                            id="bank-branch"
                            :value="details.BankBranch"
                            @input="handleInput($event, 'BankBranch')"
                        >
                            <template #label>Chi nhánh</template>
                        </VTextField>
                    </div>
                </div>
            </div>

            <div class="form-footer">
                <div class="left-group">
                    <VButton type="outline" class="cancel-btn" @click="Employee.hideDetails">
                        Hủy
                    </VButton>
                </div>

                <div class="right-group">
                    <VButton type="outline" class="add-btn" @click="handleStoreForm">
                        Cất
                    </VButton>
                    <VButton
                        type="primary"
                        class="add-more-btn"
                        @click="handleStoreAndCreateForm"
                    >
                        Cất và Thêm
                    </VButton>
                </div>
            </div>

            <!-- validate dialog -->
            <VDialog
                v-if="
                    isShowValidateDialog &&
                    Dialog.current.name === DialogName.Validate &&
                    inputErrorList.size
                "
            >
                <template #title> {{ VNDialogResources.Validate.title }} </template>
                <template #text> {{ Array.from(inputErrorList)[0] }} </template>
                <template #primaryAction>
                    <VButton type="primary" @click="hideValidateDialog">
                        {{ VNDialogResources.Validate.primaryAction }}
                    </VButton>
                </template>
            </VDialog>

            <!-- duplicated employee code -->
            <VDialog
                v-if="
                    isDuplicatedEmployeeCode &&
                    Dialog.current.name === DialogName.DuplicatedEmployeeCode
                "
            >
                <template #title>
                    {{ VNDialogResources.DuplicatedEmployeeCode.title }}</template
                >
                <template #text>
                    {{ VNDialogResources.DuplicatedEmployeeCode.text(details.EmployeeCode) }}
                </template>
                <template #primaryAction>
                    <VButton type="primary" @click="hideDuplicatedEmployeeCodeDialog">
                        {{ VNDialogResources.DuplicatedEmployeeCode.primaryAction }}
                    </VButton>
                </template>
            </VDialog>
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
@/stores/employee @/helpers/enums
