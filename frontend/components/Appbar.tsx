"use client";
import { useRouter } from "next/router"
import { LinkButton } from "./buttons/LinkButton"
import { PrimaryButton } from "./buttons/PrimaryButton";

export const Appbar = () => {
    const router = useRouter();
    return <div className="flex border-b justify-between">
        <div>
            Atto
        </div>
        <div>
            <LinkButton onClick={() => {}}>Contact Sales</LinkButton>
            <LinkButton onClick={() => {
                router.push("/login")
            }}>Login</LinkButton>
            <PrimaryButton onClick={() => {
                router.push("/signup")
            }}>
                signup
            </PrimaryButton>
        </div>

    </div>
} 