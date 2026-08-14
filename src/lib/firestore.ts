'use client'

import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  QueryConstraint,
} from 'firebase/firestore'
import { db } from './firebase'
import { Order, Driver, Restaurant, Customer, DashboardStats } from '@/types'

const hasFirestore = Boolean(db)

// Orders
export async function getOrders(
  constraints: QueryConstraint[] = []
): Promise<Order[]> {
  if (!hasFirestore || !db) {
    return []
  }

  try {
    const q = query(collection(db, 'orders'), ...constraints)
    const snapshot = await getDocs(q)
    return snapshot.docs.map((docData) => ({
      id: docData.id,
      ...docData.data(),
      createdAt: docData.data().createdAt?.toDate?.() || new Date(),
      updatedAt: docData.data().updatedAt?.toDate?.() || new Date(),
    })) as Order[]
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  if (!hasFirestore || !db) {
    return null
  }

  try {
    const docRef = doc(db, 'orders', orderId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
      } as Order
    }
    return null
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

export async function getOrdersCount(): Promise<number> {
  try {
    const orders = await getOrders()
    return orders.length
  } catch (error) {
    console.error('Error fetching orders count:', error)
    return 0
  }
}

// Drivers
export async function getDrivers(
  constraints: QueryConstraint[] = []
): Promise<Driver[]> {
  if (!hasFirestore || !db) {
    return []
  }

  try {
    const q = query(collection(db, 'drivers'), ...constraints)
    const snapshot = await getDocs(q)
    return snapshot.docs.map((docData) => ({
      id: docData.id,
      ...docData.data(),
      createdAt: docData.data().createdAt?.toDate?.() || new Date(),
      updatedAt: docData.data().updatedAt?.toDate?.() || new Date(),
    })) as Driver[]
  } catch (error) {
    console.error('Error fetching drivers:', error)
    return []
  }
}

export async function getDriversCount(): Promise<number> {
  try {
    const drivers = await getDrivers()
    return drivers.length
  } catch (error) {
    console.error('Error fetching drivers count:', error)
    return 0
  }
}

// Restaurants
export async function getRestaurants(
  constraints: QueryConstraint[] = []
): Promise<Restaurant[]> {
  if (!hasFirestore || !db) {
    return []
  }

  try {
    const q = query(collection(db, 'restaurants'), ...constraints)
    const snapshot = await getDocs(q)
    return snapshot.docs.map((docData) => ({
      id: docData.id,
      ...docData.data(),
      createdAt: docData.data().createdAt?.toDate?.() || new Date(),
      updatedAt: docData.data().updatedAt?.toDate?.() || new Date(),
    })) as Restaurant[]
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    return []
  }
}

export async function getRestaurantsCount(): Promise<number> {
  try {
    const restaurants = await getRestaurants()
    return restaurants.length
  } catch (error) {
    console.error('Error fetching restaurants count:', error)
    return 0
  }
}

// Customers
export async function getCustomers(
  constraints: QueryConstraint[] = []
): Promise<Customer[]> {
  if (!hasFirestore || !db) {
    return []
  }

  try {
    const q = query(collection(db, 'customers'), ...constraints)
    const snapshot = await getDocs(q)
    return snapshot.docs.map((docData) => ({
      id: docData.id,
      ...docData.data(),
      createdAt: docData.data().createdAt?.toDate?.() || new Date(),
      updatedAt: docData.data().updatedAt?.toDate?.() || new Date(),
    })) as Customer[]
  } catch (error) {
    console.error('Error fetching customers:', error)
    return []
  }
}

export async function getCustomersCount(): Promise<number> {
  try {
    const customers = await getCustomers()
    return customers.length
  } catch (error) {
    console.error('Error fetching customers count:', error)
    return 0
  }
}

// Dashboard Stats
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [orders, drivers, restaurants, customers] = await Promise.all([
      getOrders(),
      getDriversCount(),
      getRestaurantsCount(),
      getCustomersCount(),
    ])

    const totalOrders = orders.length
    const newOrders = orders.filter((o) => o.status === 'pending').length
    const deliveryOrders = orders.filter((o) => o.status === 'confirmed').length
    const completedOrders = orders.filter((o) => o.status === 'delivered').length

    return {
      totalOrders,
      newOrders,
      deliveryOrders,
      completedOrders,
      totalDrivers: drivers,
      totalRestaurants: restaurants,
      totalCustomers: customers,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalOrders: 0,
      newOrders: 0,
      deliveryOrders: 0,
      completedOrders: 0,
      totalDrivers: 0,
      totalRestaurants: 0,
      totalCustomers: 0,
    }
  }
}
