<script setup>
import { IconClose, IconHelp } from '@/assets/icons';
import {
    VButton,
    VCheckbox,
    VDateField,
    VRadioButton,
    VRadioField,
    VTextField
} from '@/components';
import { useEmployeeDetailsStore } from '@/stores/employeeDetails';
import { Gender } from '@/utils/enums';

const employeeDetails = useEmployeeDetailsStore();
const { currentEmployee } = employeeDetails;

const handleCancelPopup = () => {};

// const handleChangeInputValue = (value, label) => {
//     currentEmployee[label] = value;
//     console.log('afterChange:', currentEmployee);
// };
</script>

<template>
    <div class="popup add-employee-popup">
        <div class="popup-container">
            <!-- Popup header -->
            <div class="popup-header">
                <!-- Popup-header left-group -->
                <div class="left-group">
                    <div class="heading-1 heading">Thông tin nhân viên</div>
                    <VCheckbox id="customer-checkbox" label="Là khách hàng" />
                    <VCheckbox id="provider-checkbox" label="Là nhà cung cấp" />
                </div>

                <!-- Popup-header right-group -->
                <div class="right-group">
                    <IconHelp class="help-icon" />
                    <IconClose class="close-icon" @click="employeeDetails.hideDetails" />
                </div>
            </div>

            <!-- Popup content -->
            <div class="popup-content">
                <div class="group-1">
                    <div class="left-group">
                        <div style="display: flex; gap: 8px">
                            <VTextField
                                size="small"
                                width="medium"
                                id="employee-code"
                                :value="currentEmployee.EmployeeCode"
                                @textValue="handleChangeInputValue($event, 'EmployeeCode')"
                                required
                                :errMsgs="{ isEmpty: `Mã không được để trống` }"
                                firstFocus
                            >
                                <template #label>Mã</template>
                            </VTextField>

                            <VTextField
                                size="small"
                                width="large"
                                id="full-name"
                                :value="currentEmployee.FullName"
                                title="title"
                                @textValue="handleChangeInputValue($event, 'FullName')"
                                required
                                :errMsgs="{ isEmpty: 'Tên không được để trống' }"
                            >
                                <template #label>Tên</template>
                            </VTextField>
                        </div>

                        <VTextField
                            size="small"
                            width="full"
                            id="department-name"
                            required
                            :value="currentEmployee.DepartmentName"
                            @textValue="handleChangeInputValue($event, 'DepartmentName')"
                            :errMsgs="{
                                isEmpty: `Đơn vị không được để trống`,
                                isInvalid: `Dữ liệu Đơn vị không có trong danh mục`
                            }"
                        >
                            <template #label>Đơn vị</template>
                        </VTextField>

                        <VTextField
                            size="small"
                            width="full"
                            id="position-name"
                            :value="currentEmployee.PositionName"
                            @textValue="handleChangeInputValue($event, 'PositionName')"
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
                                :value="currentEmployee.DateOfBirth"
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
                                        :checked="currentEmployee.Gender === Gender.Male"
                                    >
                                        <template #label>Nam</template>
                                    </VRadioButton>

                                    <VRadioButton
                                        id="female"
                                        name="gender"
                                        :value="Gender.Female"
                                        :checked="currentEmployee.Gender === Gender.Female"
                                    >
                                        >
                                        <template #label>Nữ</template>
                                    </VRadioButton>

                                    <VRadioButton
                                        id="other"
                                        name="gender"
                                        :value="Gender.Other"
                                        :checked="currentEmployee.Gender === Gender.Other"
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
                                :value="currentEmployee.IdentityNumber"
                                @textValue="handleChangeInputValue($event, 'IdentityNumber')"
                            >
                                <template #label>Số CMND</template>
                            </VTextField>

                            <VDateField
                                size="small"
                                id="date-of-issue"
                                :value="currentEmployee.DateOfIssue"
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
                            :value="currentEmployee.PlaceOfIssue"
                            @textValue="handleChangeInputValue($event, 'IdentityPlace')"
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
                    :value="currentEmployee.Address"
                    @textValue="handleChangeInputValue($event, 'Address')"
                >
                    <template #label>Địa chỉ</template>
                </VTextField>

                <div class="group-2">
                    <div class="first-line">
                        <VTextField
                            size="small"
                            width="large"
                            id="mobile-phone"
                            :value="currentEmployee.MobilePhone"
                        >
                            <template #label>ĐT di động</template>
                        </VTextField>

                        <VTextField
                            size="small"
                            width="large"
                            id="landline-phone"
                            :value="currentEmployee.LandlinePhone"
                        >
                            <template #label>ĐT cố định</template>
                        </VTextField>

                        <VTextField
                            size="small"
                            width="large"
                            id="email"
                            :value="currentEmployee.Email"
                            @textValue="handleChangeInputValue($event, 'Email')"
                        >
                            <template #label>Email</template>
                        </VTextField>
                    </div>

                    <div class="second-line">
                        <VTextField
                            size="small"
                            width="large"
                            id="bank-account"
                            :value="currentEmployee.BankAccount"
                        >
                            <template #label>Tài khoản ngân hàng</template>
                        </VTextField>

                        <VTextField
                            size="small"
                            width="large"
                            id="bank-name"
                            :value="currentEmployee.BankName"
                        >
                            <template #label>Tên ngân hàng</template>
                        </VTextField>

                        <VTextField
                            size="small"
                            width="large"
                            id="bank-branch"
                            :value="currentEmployee.BankBranch"
                        >
                            <template #label>Chi nhánh</template>
                        </VTextField>
                    </div>
                </div>
            </div>

            <div class="popup-footer">
                <div class="left-group">
                    <VButton type="outline" class="cancel-btn" @click="handleCancelPopup">
                        Hủy
                    </VButton>
                </div>

                <div class="right-group">
                    <VButton type="outline" class="add-btn" onclick="validateEmptyTextField">
                        Cất
                    </VButton>
                    <VButton
                        type="primary"
                        class="add-more-btn"
                        onclick="validateEmptyTextField"
                    >
                        Cất và Thêm</VButton
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
.popup {
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

.popup-container {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    background-color: rgb(var(--c-white));
}

/* Styles for popup-header */
.popup-header {
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

/* Styles for popup-content */
.popup-content {
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

/* Styles for popup-footer */
.popup-footer {
    display: flex;
    justify-content: space-between;
    padding: 12px 24px;
    border-radius: 0 0 4px 4px;

    background-color: rgb(var(--c-gray-200));
    border-top: 1px solid rgb(var(--c-gray-300));
    .right-group {
        display: flex;
        gap: 8px;
    }
}
</style>
