"use client";

import { auth } from '@/app/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React , { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from 'next/link';


type Inputs = {
  email: string;
  password: string;
}

const Register = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await createUserWithEmailAndPassword(auth, data.email, data.password).then((userCrendential) => {
      const user = userCrendential.user;
      router.push("/auth/login");
    })
    .catch((error) => {
      // console.error(error);
      // alert(error);
      if (error.code === "auth/email-already-in-use") {
        alert("このメールアドレスはすでに使用されています。");
      } else {
        alert(error.message);
      }
    });
  }


  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="mb-4 text-2xl text-gray-700 font-medium">新規登録</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input {...register("email", {
            required: "メールアドレスは必須です。",
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
              message: "不適切なメールアドレスです。",
            },
          })} type="text" className="mt-1 border-2 rounded-md w-full p-2" />
          {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input type="password" {...register("password", {
            required: "パスワードは必須です。",
            validate: {
              minLength: (value) => value.length >= 6 || "6文字以上で入力してください",
              maxLength: (value) => value.length <= 20 || "20文字以下で入力してください",
            }
          })} className="mt-1 border-2 rounded-md w-full p-2" />
          {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white rounded font-bold  px-4 py-2 hover:bg-blue-700 ">新規登録</button>
        </div>
        <div className="mt-4">
          <span className="text-gray-600 ">
            アカウントをお持ちですか？
          </span>
          <Link href={"/auth/login"} className="text-blue-500 font-bold  ml-1 ">ログインページへ</Link>
        </div>

      </form>
    </div>
  )
}

export default Register;

// labelにblock要素を使う理由
// labelの後に改行が入り、次に続く要素(input)が新しい行に配置されるこれによりラベルと入力フィールドが縦に並び、フォームの見た目が整う。

