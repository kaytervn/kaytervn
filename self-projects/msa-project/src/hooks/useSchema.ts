import { useMemo } from "react";
import * as yup from "yup";

export const useAccountSchema = (
  isCreate: boolean,
  isUpdate: boolean,
  isParent: boolean
) => {
  return useMemo(() => {
    const requireAuth = isCreate || (isUpdate && isParent);

    const shape: Record<string, any> = {
      platformId: yup.number().required("Nền tảng không hợp lệ"),
      note: yup.string().optional(),
      codes: yup.string().optional(),
    };

    if (requireAuth) {
      shape.username = yup.string().required("Tài khoản không hợp lệ");
      shape.password = yup.string().required("Mật khẩu không hợp lệ");
    }

    return yup.object().shape(shape);
  }, [isCreate, isUpdate, isParent]);
};
