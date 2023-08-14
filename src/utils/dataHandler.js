/**
 * Handling data returned from an API and formatting it according to each data field.
 */
import { Gender } from './enums';

export const getGender = (genderNumber) => {
    if (genderNumber === null) return '';
    switch (genderNumber) {
        case Gender.Male:
            return 'Nam';
        case Gender.Female:
            return 'Nữ';
        case Gender.Other:
            return 'Khác';
        default:
            return 'Không hợp lệ';
    }
};

export const getDate = (date) => {
    if (date) return '';
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-GB');
    return formattedDate;
};
