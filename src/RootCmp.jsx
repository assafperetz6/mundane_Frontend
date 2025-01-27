import React from 'react'
import { Routes, Route, Navigate } from 'react-router'

import { HomePage } from './pages/HomePage'
import { AboutUs } from './pages/AboutUs'
import { AdminIndex } from './pages/AdminIndex.jsx'

import { UserDetails } from './pages/UserDetails'

import { UserMsg } from './cmps/UserMsg.jsx'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { BoardIndex } from './pages/BoardIndex.jsx'
import { BoardDetails } from './pages/BoardDetails.jsx'
import { SideBar } from './cmps/SideBar.jsx'
import { TopBar } from './cmps/TopBar.jsx'
import { TaskDetails } from './cmps/TaskDetails.jsx'
import { LandingPage } from './pages/LandingPage.jsx'

export function RootCmp() {
	return (
		<div className="main-container">
			<TopBar />
			<SideBar />
			<UserMsg />

			<main>
				<Routes>
					<Route path="/" element={<Navigate to="/home" />} />
					<Route path="/home" element={<LandingPage />} />
					<Route path="about" element={<AboutUs />} />
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="board" element={<BoardIndex />} />
					<Route path="board/:boardId" element={<BoardDetails />}>
						<Route path="task/:taskId" element={<TaskDetails />} />
					</Route>
					<Route path="user/:id" element={<UserDetails />} />
					<Route path="admin" element={<AdminIndex />} />
					<Route path="login" element={<LoginSignup />} />
				</Routes>
			</main>
		</div>
	)
}
