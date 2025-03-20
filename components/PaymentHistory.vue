<template>
    <div class="bg-white rounded-xl p-8 shadow-sm max-w-3xl mx-auto">
      <!-- Payment Method Section -->
      <div class="mb-8">
        <h2 class="text-sm text-gray-500 font-medium mb-4">Payment method</h2>
        <div class="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div class="flex items-center">
            <div class="bg-sky-400 rounded-full w-10 h-10 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            <div>
              <div class="font-medium">Card</div>
              <div class="flex items-center">
                <span class="text-xs font-bold mr-1">VISA</span>
                <span class="text-xs text-gray-500">3781</span>
              </div>
            </div>
          </div>
          <button class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
  
      <!-- Payment History Section -->
      <div>
        <h2 class="text-sm text-gray-500 font-medium mb-4">Payment history</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="py-3 px-4 text-left text-xs font-medium text-gray-500">Date</th>
                <th class="py-3 px-4 text-left text-xs font-medium text-gray-500">Product</th>
                <th class="py-3 px-4 text-left text-xs font-medium text-gray-500">Period</th>
                <th class="py-3 px-4 text-left text-xs font-medium text-gray-500">Bonuses</th>
                <th class="py-3 px-4 text-left text-xs font-medium text-gray-500">Paid</th>
                <th class="py-3 px-4 text-left text-xs font-medium text-gray-500">Card</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(payment, index) in paymentHistory" :key="index" 
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                <td class="py-3 px-4 text-xs text-gray-800">{{ payment.date }}</td>
                <td class="py-3 px-4 text-xs text-gray-800">{{ payment.product }}</td>
                <td class="py-3 px-4 text-xs text-gray-800">{{ payment.period }}</td>
                <td class="py-3 px-4 text-xs text-gray-800">{{ payment.bonuses }}</td>
                <td class="py-3 px-4 text-xs text-gray-800">{{ payment.paid }}</td>
                <td class="py-3 px-4 text-xs text-gray-800">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    <span>{{ payment.card }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const paymentHistory = [
    {
      date: '21:31, 22 July (UTC+0)',
      product: 'Subscription plan',
      period: '2 d. / 30 days',
      bonuses: '1 USD',
      paid: '6 USD',
      card: '3781'
    },
    {
      date: '17:55, 17 June (UTC+0)',
      product: 'Subscription plan',
      period: '2 d. / 30 days',
      bonuses: '1 USD',
      paid: '6 USD',
      card: '3781'
    },
    {
      date: '20:21, 16 May (UTC+0)',
      product: 'Subscription plan',
      period: '2 d. / 30 days',
      bonuses: '1 USD',
      paid: '6 USD',
      card: '3781'
    },
    {
      date: '20:46, 08 April (UTC+0)',
      product: 'Subscription plan',
      period: '2 d. / 30 days',
      bonuses: '1 USD',
      paid: '6 USD',
      card: '3781'
    },
    {
      date: '03:03, 28 March (UTC+0)',
      product: 'Subscription plan',
      period: '7 d. / 7 days',
      bonuses: '1 USD',
      paid: '8 USD',
      card: '3781'
    }
  ]
  </script>