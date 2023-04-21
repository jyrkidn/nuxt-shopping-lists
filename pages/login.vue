<template>
    <div>
        <form class="px-8 pt-6 pb-8 mb-4" @submit.prevent="login">
            <div v-if="state.error" class="mb-4 border rounded bg-red-400 border-red-600 py-2 px-3">
                {{ state.error }}
            </div>
			<div class="mb-4">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="username">
					Email
				</label>
				<input
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					id="email"
					name="email"
					type="email"
					placeholder="Email"
                    v-model="state.email"
				/>
			</div>
			<div class="mb-6">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="password">
					Password
				</label>
				<input
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
					id="password"
					name="password"
					type="password"
					v-model="state.password"
					placeholder="******************"
				/>
			</div>
			<div class="flex items-center justify-between">
				<button
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					type="submit"
				>
					Sign In
				</button>
			</div>
		</form>
    </div>
</template>

<script setup>
const auth = useFirebaseAuth()
import { signInWithEmailAndPassword } from "firebase/auth";

const state = reactive({ email: '', password: '', error: '' })

const login = async () => {
    state.error = ''
    try {
        await signInWithEmailAndPassword(auth, state.email, state.password)
    } catch (error) {
        state.error = `An error occured (${error.code}). Please try again.`
    }
}
</script>