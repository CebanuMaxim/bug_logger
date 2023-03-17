import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'
import LogItem from "./LogItem"
import AddLogItem from "./AddLogItem"
import { ipcRenderer } from 'electron'

const App = () => {
	const [logs, setLogs] = useState([])

	const [alert, setAlert] = useState({
		show: false,
		message: '',
		variant: 'success'
	})

	useEffect(() => {
		ipcRenderer.send('logs:load')

		ipcRenderer.on('logs:get', (e, logs) => {
			setLogs(JSON.parse(logs))
		})

		ipcRenderer.on('logs:clear', () => {
			setLogs([])
			showAlert('Logs cleared')
		})

	}, [])

	function addItem(item) {
		if (item.text === '' || item.user === '' || item.priority === '') {
			showAlert('Please fill all the fields', 'danger')
			return
		}

		ipcRenderer.send('logs:add', item)

		showAlert('Log Added')
	}

	function showAlert(message, variant = 'success', seconds = 1000) {
		setAlert({
			show: true,
			message,
			variant
		})

		setTimeout(() => {
			setAlert({
				show: false,
				message: '',
				variant: 'success'
			})
		}, seconds)
	}

	function deleteItem(_id) {
		ipcRenderer.send('logs:delete', _id)
		showAlert('Log removed')
	}

	return (
		<Container fluid='lg' className='app'>
			<AddLogItem addItem={addItem} />
			{alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
			<Table>
				<thead>
					<tr>
						<th>Priority</th>
						<th>Log Text</th>
						<th>User</th>
						<th>Created</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{
						logs.map((log) => (
							<LogItem key={log._id} log={log} deleteItem={deleteItem} />
						))
					}
				</tbody>
			</Table>
		</Container>
	)
}

export default App
