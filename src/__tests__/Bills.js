/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import { toHaveAttribute } from "@testing-library/jest-dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import { bills } from "../fixtures/bills.js"
import router from "../app/Router";
import preview from 'jest-preview';

jest.mock("../app/store", () => mockStore)
  
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)

      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')

      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })

    test("Then bills should be ordered from earliest to latest", () => {

      document.body.innerHTML = BillsUI({ data: bills })

      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
  
  describe("Given I am on Bills Page", () => {

    beforeEach(() => {
      document.body.innerHTML = BillsUI({ data: bills })
    })
    afterEach(() => {
      document.body.innerHTML = ''
    })
    
    describe("When I click the eye icon of the first bill", () => {
      test("Then, it should insert the first bill image in the modale", async () => {
        
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }

        const testBills = new Bills({ document, onNavigate, store: mockStore, localStorage: null })

        await waitFor(() => screen.getAllByTestId('icon-eye')[0])
        const firstIconEye = screen.getAllByTestId('icon-eye')[0]
        const handleClickIconEyeTest = jest.fn(() => testBills.handleClickIconEye(firstIconEye))
        firstIconEye.addEventListener('click', handleClickIconEyeTest)

        // To avoid => TypeError: $(...).modal is not a function
        $.fn.modal = jest.fn();

        // Simulate the click on the first eye icon
        userEvent.click(firstIconEye);

        await waitFor(() => document.querySelector('.bill-proof-container'))
        const billProofContainer = document.querySelector('.bill-proof-container')
        const imageFirstBill = screen.getByAltText("Bill")

        expect(handleClickIconEyeTest).toHaveBeenCalled()
        expect(billProofContainer).toBeTruthy()
        expect(imageFirstBill.getAttribute('src')).toMatch(/.*c1640e12-a24b-4b11-ae52-529112e9602a$/)
      })
    })

    describe("When I click on the new bill button", () => {
      test("Then, it should render the NewBill page", async () => {

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        // Instanciation of Bills
        const testBills = new Bills({ document, onNavigate, store: null, localStorage: null })
        
        const handleClickNewBillTest = jest.fn(() => testBills.handleClickNewBill())
        const buttonNewBill = screen.getByTestId('btn-new-bill')
        buttonNewBill.addEventListener('click', handleClickNewBillTest)

        // Simulate the click on new bill
        userEvent.click(buttonNewBill);

        await waitFor(() => screen.getByTestId('form-new-bill'))

        expect(handleClickNewBillTest).toHaveBeenCalled()
        // it should render the NewBill page
        expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
      })
    })

    describe("When calling getBills with invalid store", () => {
      test("Then, it should return undefined", () => {
        
        // Instanciation of NewBill
        const testBills = new Bills({ document, onNavigate: null, store: null, localStorage: null })

        // Call getBills
        const listOfBills = testBills.getBills()

        expect(listOfBills).toBeUndefined();
      })
    })

    describe("When calling getBills with valid store", () => {
      test("Then, it should return correct list of bills with correct format date and format status", async () => {

        // Instanciation of NewBill
        const testBills = new Bills({ document, onNavigate: null, store: mockStore, localStorage: null })

        // Call getBills
        const listOfBills = await testBills.getBills()

        expect(listOfBills.length).toBe(4)

        // Test the first bill fomarted date and status
        expect(listOfBills[0].date).toMatch('4 Avr. 04');
        expect(listOfBills[0].status).toMatch('En attente');
      })
    })
  })
})

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills page", () => {

    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "e@e" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))

      await waitFor(() => screen.getByText("test1"))
      const billTest1  = screen.getByText("test1")
      expect(billTest1).toBeTruthy()
      const billTest2  = screen.getByText("test2")
      expect(billTest2).toBeTruthy()
      const billTest3  = screen.getByText("test3")
      expect(billTest3).toBeTruthy()
      const billEncore  = screen.getByText("encore")
      expect(billEncore).toBeTruthy()
    })

    describe("When an error occurs on API", () => {

      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
            window,
            'localStorage',
            { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "e@e"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })

      test("fetches bills from an API and fails with 404 message error", async () => {

        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 404"))
            }
          }})
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        await waitFor(() => screen.getByText(/Erreur 404/))
        const message = screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })

      test("fetches messages from an API and fails with 500 message error", async () => {

        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 500"))
            }
          }})

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        await waitFor(() => screen.getByText(/Erreur 500/))
        const message = screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  })
})