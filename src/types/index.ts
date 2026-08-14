export type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled'
export type DriverStatus = 'available' | 'busy' | 'offline'

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerPhone: string
  restaurantId: string
  restaurantName: string
  driverId?: string
  driverName?: string
  status: OrderStatus
  price: number
  createdAt: Date
  updatedAt: Date
  deliveryAddress?: string
  notes?: string
}

export interface Driver {
  id: string
  name: string
  phone: string
  status: DriverStatus
  totalOrders: number
  completedOrders: number
  rating?: number
  createdAt: Date
  updatedAt: Date
}

export interface Restaurant {
  id: string
  name: string
  phone: string
  address: string
  logo?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  totalOrders: number
  totalSpent: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  role: 'admin' | 'manager'
  createdAt: Date
}

export interface DashboardStats {
  totalOrders: number
  newOrders: number
  deliveryOrders: number
  completedOrders: number
  totalDrivers: number
  totalRestaurants: number
  totalCustomers: number
}
