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
                    <IconClose class="close-icon" @click="$state.showTablePopup = false" />
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
                                id="employee-code-textfield"
                                :value="localEmployeeData.EmployeeCode"
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
                                id="full-name-textfield"
                                :value="localEmployeeData.FullName"
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
                            id="department-name-textfield"
                            required
                            :value="localEmployeeData.DepartmentName"
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
                            id="position-name-textfield"
                            :value="localEmployeeData.PositionName"
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
                                id="date-of-birth-datefield"
                                :value="localEmployeeData.DateOfBirth"
                            >
                                <template #label>Ngày sinh</template>
                            </VDateField>

                            <VRadioField id="gender-radiofield" :value="localEmployeeData.Gender">
                                <template #label>Giới tính</template>
                                <template #input>
                                    <VRadioButton
                                        id="male-gender"
                                        name="gender"
                                        :value="localEmployeeData.Gender === 0"
                                        @update:radioValue="abc()"
                                    >
                                        <template #label>Nam</template>
                                    </VRadioButton>

                                    <VRadioButton
                                        id="female-gender"
                                        name="gender"
                                        :value="localEmployeeData.Gender === 1"
                                    >
                                        <template #label>Nữ</template>
                                    </VRadioButton>

                                    <VRadioButton
                                        id="other-gender"
                                        name="gender"
                                        :value="localEmployeeData.Gender === 2"
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
                                id="identity-number-textfield"
                                title="Số chứng minh nhân dân"
                                :value="localEmployeeData.IdentityNumber"
                                @textValue="handleChangeInputValue($event, 'IdentityNumber')"
                            >
                                <template #label>Số CMND</template>
                            </VTextField>

                            <VDateField size="small" id="identity-date-datefield">
                                <template #label>Ngày cấp</template>
                            </VDateField>
                        </div>

                        <VTextField
                            size="small"
                            width="full"
                            id="identity-department-textfield"
                            :value="localEmployeeData.IdentityPlace"
                            @textValue="handleChangeInputValue($event, 'IdentityPlace')"
                        >
                            <template #label>Nơi cấp</template>
                        </VTextField>
                    </div>
                </div>

                <VTextField
                    size="small"
                    width="full"
                    id="address-textfield"
                    style="margin: 24px 0 14px"
                    :value="localEmployeeData.Address"
                    @textValue="handleChangeInputValue($event, 'Address')"
                >
                    <template #label>Địa chỉ</template>
                </VTextField>

                <div class="group-2">
                    <div class="first-line">
                        <VTextField
                            size="small"
                            width="large"
                            id="phone-textfield"
                            :value="localEmployeeData.PhoneNumber"
                            @textValue="handleChangeInputValue($event, 'PhoneNumber')"
                        >
                            <template #label>ĐT di động</template>
                        </VTextField>

                        <VTextField size="small" width="large" id="fax-textfield">
                            <template #label>ĐT cố định</template>
                        </VTextField>

                        <VTextField
                            size="small"
                            width="large"
                            id="email-textfield"
                            :value="localEmployeeData.Email"
                            @textValue="handleChangeInputValue($event, 'Email')"
                        >
                            <template #label>Email</template>
                        </VTextField>
                    </div>

                    <div class="second-line">
                        <VTextField size="small" width="large" id="bank-account-textfield">
                            <template #label>Tài khoản ngân hàng</template>
                        </VTextField>

                        <VTextField size="small" width="large" id="bank-name-textfield">
                            <template #label>Tên ngân hàng</template>
                        </VTextField>

                        <VTextField size="small" width="large" id="bank-branch-textfield">
                            <template #label>Chi nhánh</template>
                        </VTextField>
                    </div>
                </div>
            </div>

            <div class="popup-footer">
                <div class="left-group">
                    <VButton
                        size="medium"
                        type="outline"
                        text="Hủy"
                        class="cancel-btn"
                        @click="handleCancelPopup()"
                    />
                </div>

                <div class="right-group">
                    <VButton
                        size="medium"
                        type="outline"
                        text="Cất"
                        class="add-btn"
                        onclick="validateEmptyTextField()"
                    />
                    <VButton
                        size="medium"
                        type="primary"
                        text="Cất và thêm"
                        class="add-more-btn"
                        onclick="validateEmptyTextField()"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { IconClose, IconHelp } from '@/assets/icons';
import { VButton, VCheckbox, VDateField, VRadioButton, VRadioField, VTextField } from '@/components';

const props = defineProps({
    employeeData: {
        type: Object,
        required: true
    }
});

const localEmployeeData = reactive(props.employeeData);
console.log(localEmployeeData);

const handleCancelPopup = () => {};

const handleChangeInputValue = (value, label) => {
    localEmployeeData[label] = value;
    console.log('afterChange:', localEmployeeData);
};
</script>

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
    gap: 24px;
    .group-1 {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        .left-group,
        .right-group {
            display: flex;
            flex-direction: column;
            gap: 14px;
        }
    }
    .group-2 {
        display: flex;
        flex-direction: column;
        gap: 14px;
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
    padding: 16px 24px;
    border-radius: 0 0 4px 4px;

    background-color: rgb(var(--c-gray-100));
    border-top: 1px solid rgb(var(--c-gray-300));
    .right-group {
        display: flex;
        gap: 8px;
    }
}
</style>
