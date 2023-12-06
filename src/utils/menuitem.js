import {
    IconBag,
    IconBank,
    IconBook,
    IconCart,
    IconCash,
    IconDashBoard,
    IconFixedAssets,
    IconForm,
    IconPrice,
    IconSalary,
    IconStock,
    IconTax,
    IconTools,
} from '@/assets/icons';
import { MenuItem } from './enum';

export const menuItemList = [
    {
        icon: IconDashBoard,
        title: [MenuItem.DashBoard],
    },
    {
        icon: IconCash,
        title: [MenuItem.Cash],
    },
    {
        icon: IconBank,
        title: [MenuItem.Bank],
    },
    {
        icon: IconBag,
        title: [MenuItem.Bag],
    },
    {
        icon: IconCart,
        title: [MenuItem.Cart],
    },
    {
        icon: IconForm,
        title: [MenuItem.Form],
    },
    {
        icon: IconStock,
        title: [MenuItem.Stock]
    },
    {
        icon: IconTools,
        title: [MenuItem.Tools],
    },
    {
        icon: IconFixedAssets,
        title: [MenuItem.FixedAssets],
    },
    {
        icon: IconSalary,
        title: [MenuItem.Salary],
    },
    {
        icon: IconTax,
        title: [MenuItem.Tax]
    },
    {
        icon: IconPrice,
        title: [MenuItem.Price],
    },
    {
        icon: IconBook,
        title: [MenuItem.Book],
    },
];
