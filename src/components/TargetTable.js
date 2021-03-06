import React, { useState, useEffect } from 'react'
import { Table, Popconfirm, notification } from 'antd';
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import LocalStorageService from '../config/service'

function TargetTable() {

    const [userTargetData, setUserTargetData] = useState('')

    useEffect(() => {
        axios.get(`/targets/`).then((res) => {
            setUserTargetData(res.data)
        })
            .catch((err) => {
                console.log(err)
            })
    }, [])


    const [userTotalTarget, setUserTotalTarget] = useState('')

    useEffect(() => {
        axios.get(`/targets/total`).then((res) => {
            setUserTotalTarget(res.data)
        })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const [idTargetData, setIdTargetData] = useState('')

    const columns = [
        {
            title: 'รายการเป้าหมาย',
            dataIndex: 'target_list',
        },
        {
            title: 'มูลค่าของรายจ่ายของเป้าหมายนี้ (ต่อครั้ง)',
            dataIndex: 'target_value_per_time'
        }
        ,
        {
            title: 'จำนวนครั้งที่ต้องชำระ(ต่อเดือน)',
            dataIndex: 'target_quantity_per_month'
        },
        {
            title: 'มูลค่าที่ต้องจ่าย (ต่อเดือน)',
            dataIndex: 'target_value'
        },
        {
            title: 'ลบ',
            render: () => (
                <Popconfirm title="Sure to delete?"
                    onConfirm={() => {
                        axios.delete(`/targets/${idTargetData}`)
                            .then(res => {
                                notification.success({
                                    message: `Delete list already`
                                })

                            })
                            .catch(err => {
                                notification.error({
                                    message: `Cannot delete`
                                })
                            })
                        window.location.reload(true)

                    }
                    }>
                    <a>Delete</a>
                </Popconfirm>)
        }



    ];


    const [userData, setUserData] = useState('')

    useEffect(() => {
        const token = LocalStorageService.getToken()
        if (token) {
            const user = jwtDecode(token)
            axios.get(`/users/${user.id}`).then((res) => {
                setUserData(res.data)
            })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [])

    const monthRemainToRetired = Math.floor(((((new Date(userData.retired_time)) - new Date()) / (1000 * 3600 * 24)) / 365) * 12)
    const monthRemainToRestInPeace = Math.floor(((((new Date(userData.rest_in_peace_time)) - new Date()) / (1000 * 3600 * 24)) / 365) * 12)
    const remainTimeAfterRetired = monthRemainToRestInPeace - monthRemainToRetired
    console.log(remainTimeAfterRetired)

    const resultColumns = [
        {
            title: 'คุณต้องออมเงินเพื่อทำตามเป้าหมายที่คุณตั้งเอาไว้เป็นจำนวนทั้งสิ้น (เริ่มใช้เงินวันแรกคือวันเกษียณ)',
            dataIndex: 'target_total'
        }
    ]



    const totalTarget = [
        {
            target_total: `${userTotalTarget * remainTimeAfterRetired}`
        }
    ]



    return (
        <div>
            <Table
                columns={columns.filter(col => col.dataIndex !== 'id')}
                dataSource={userTargetData}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: e => { setIdTargetData(record.id) }
                    }
                }
                }
            />
            <Table columns={resultColumns} dataSource={totalTarget} pagination={false} />
        </div>
    )
}

export default TargetTable
