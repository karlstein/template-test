"use client";

import { signIn } from "next-auth/react";
import { getSession } from "@/lib/auth";
import { useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import ChromeIcon from "@/app-components/project/icons/chrome-icon";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    getSession().then((val) => {
      if (val) router.replace("/project");
    });
  }, [router]);

  return (
    <Fragment>
      {/* <!-- Logo --> */}
      <a
        href="index.html"
        className="absolute top-6 left-12 text-accent font-bold text-lg no-underline md:top-4 md:left-4"
      >
        <span className="text-white">Code Push Server</span>
      </a>

      <div className="w-full max-w-[900px] flex bg-card-bg rounded-lg overflow-hidden shadow-2xl border border-white/5 relative md:flex-col">
        {/* <!-- Main content --> */}
        <div className="w-3/5 p-12 flex flex-col justify-center md:w-full md:p-8 md:order-1">
          <div className="mb-8 text-center">
            <h2 className="text-4xl mb-2">Welcome Back</h2>
            <p className="text-secondary-text">
              Please enter your details to sign in
            </p>
          </div>

          <form className="flex flex-col gap-6">
            <button
              type="button"
              className="flex items-center justify-center gap-3 p-3 bg-white/5 border border-white/10 rounded-md text-white font-medium cursor-pointer transition-all hover:bg-white/10"
              onClick={() => signIn("google")}
            >
              <span className="flex items-center justify-center">
                {/* TODO - 3. Change this svg into react component that can be changed by assign new value into props */}
                <ChromeIcon width={18} height={18}/>
                {/* Change this svg into react component */}
              </span>
              Continue with Google
            </button>
          </form>

          {/* <div className="mt-8 text-center text-sm text-secondary-text">
            Don't have an account?{" "}
            <a href="#" className="text-accent no-underline">
              Sign up
            </a>
          </div> */}
        </div>
      </div>
    </Fragment>
  );
};

export default Page;

const LoginForms = () => {
  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm text-secondary-text">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="p-3 bg-white/5 border border-white/10 rounded-md text-white text-base transition-all focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(78,205,196,0.2)]"
          placeholder="Enter your email"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm text-secondary-text">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="p-3 bg-white/5 border border-white/10 rounded-md text-white text-base transition-all focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(78,205,196,0.2)]"
          placeholder="Enter your password"
        />
      </div>

      <div className="flex justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded" /> Remember me
        </label>
        <a
          href="#"
          className="text-secondary-text no-underline hover:text-accent transition-colors"
        >
          Forgot password?
        </a>
      </div>

      <button
        type="button"
        className="bg-accent text-bg-dark p-3 border-none rounded-md font-semibold cursor-pointer transition-all mt-4 hover:bg-[#3db9b0]"
      >
        Sign In
      </button>

      <div className="flex items-center my-6 text-secondary-text">
        <div className="flex-grow h-px bg-white/10"></div>
        <div className="px-4 text-sm">OR</div>
        <div className="flex-grow h-px bg-white/10"></div>
      </div>
    </Fragment>
  );
};
