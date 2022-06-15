/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router";
import preview from 'jest-preview';

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      await waitFor(() => screen.getByTestId('icon-mail'))
      const windowIcon = screen.getByTestId('icon-mail')

      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })
  })

  describe("Given I am on NewBill Page", () => {

    beforeEach(() => {
      document.body.innerHTML = NewBillUI();
      
      window.localStorage.clear();
      Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "e@e"
      }))
    })
    afterEach(() => {
      document.body.innerHTML = ''
    })

    describe("When I attach a wrong (not .jpg or .png) file to the form", () => {
      test("Then no file shoud be attached and an error should be displayed", async () => {

        // Instanciation of NewBill
        const newBill = new NewBill({ document, onNavigate: null, store: mockStore, localStorage: window.localStorage });

        // HTML input element to attach file
        const inputFiles = screen.getByTestId('file')
        // Instanciation of test File
        const testFile = new File(["(⌐□_□)"], 'test.txt', { type: "plain/txt" });

        const handleChangeFileTest = jest.fn((e) => newBill.handleChangeFile(e))
        inputFiles.addEventListener('change', handleChangeFileTest)

        // Spy on the mocks : localStorage and store
        const spyStorageGetItem = jest.spyOn(localStorageMock, "getItem")
        const spyStore = jest.spyOn(mockStore, "bills")

        // Simulate the upload of the file
        await waitFor(() => {
              userEvent.upload(inputFiles, testFile);
        });
        
        // Change file handler is called
        expect(handleChangeFileTest).toHaveBeenCalled();
        // New bill is not created
        expect(spyStorageGetItem).not.toHaveBeenCalled();
        expect(spyStore).not.toHaveBeenCalled();
        expect(newBill.fileName).toBeNull()
        expect(newBill.billId).toBeNull()
        expect(newBill.fileUrl).toBeNull()

      })
    })

    describe("When I attach a valid image file to the form", () => {
      describe("With extension .jpg", () => {
        test("Then new bill is created and stored", async () => {

          // Instanciation of NewBill
          const newBill = new NewBill({ document, onNavigate: null, store: mockStore, localStorage: window.localStorage });

          // HTML input element to attach file
          const inputFiles = screen.getByTestId('file')
          // Instanciation of test File
          const testFile = new File(["(⌐□_□)"], 'test.jpg', { type: "image/jpg" });

          const handleChangeFile1 = jest.fn((e) => newBill.handleChangeFile(e))
          inputFiles.addEventListener('change', handleChangeFile1)

          // Spy on the mocks : localStorage and store
          const spyStorageGetItem = jest.spyOn(localStorageMock, "getItem")
          const spyStore = jest.spyOn(mockStore, "bills")

          // Simulate the upload of the file
          await waitFor(() => {
            userEvent.upload(inputFiles, testFile);
          });
      
          // Change file handler is called
          expect(handleChangeFile1).toHaveBeenCalled();
          
          // New bill is created
          expect(spyStorageGetItem).toHaveBeenCalledWith('user');
          expect(spyStore).toHaveBeenCalled();
          expect(newBill.fileName).toBe("test.jpg")
          expect(newBill.billId).toBe("1234")
          expect(newBill.fileUrl).toBe("https://localhost:3456/images/test.jpg")
          expect(inputFiles.files[0]).toStrictEqual(testFile);
        })
      })
      describe("With extension .JPG", () => {
        test("Then new bill is created and stored", async () => {

          // Instanciation of NewBill
          const newBill = new NewBill({ document, onNavigate: null, store: mockStore, localStorage: window.localStorage });

          // HTML input element to attach file
          const inputFiles = screen.getByTestId('file')
          // Instanciation of test File
          const testFile = new File(["(⌐□_□)"], 'test.JPG', { type: "image/jpg" });

          const handleChangeFile1 = jest.fn((e) => newBill.handleChangeFile(e))
          inputFiles.addEventListener('change', handleChangeFile1)

          // Spy on the mocks : localStorage and store
          const spyStorageGetItem = jest.spyOn(localStorageMock, "getItem")
          const spyStore = jest.spyOn(mockStore, "bills")

          // Simulate the upload of the file
          await waitFor(() => {
            userEvent.upload(inputFiles, testFile);
          });
      
          // Change file handler is called
          expect(handleChangeFile1).toHaveBeenCalled();
          
          // New bill is created
          expect(spyStorageGetItem).toHaveBeenCalledWith('user');
          expect(spyStore).toHaveBeenCalled();
          expect(newBill.fileName).toBe("test.JPG")
          expect(newBill.billId).toBe("1234")
          expect(newBill.fileUrl).toBe("https://localhost:3456/images/test.jpg")
          expect(inputFiles.files[0]).toStrictEqual(testFile);
        })
      })
      describe("With extension .jpeg", () => {
        test("Then new bill is created and stored", async () => {

          // Instanciation of NewBill
          const newBill = new NewBill({ document, onNavigate: null, store: mockStore, localStorage: window.localStorage });

          // HTML input element to attach file
          const inputFiles = screen.getByTestId('file')
          // Instanciation of test File
          const testFile = new File(["(⌐□_□)"], 'test.jpeg', { type: "image/jpg" });

          const handleChangeFile1 = jest.fn((e) => newBill.handleChangeFile(e))
          inputFiles.addEventListener('change', handleChangeFile1)

          // Spy on the mocks : localStorage and store
          const spyStorageGetItem = jest.spyOn(localStorageMock, "getItem")
          const spyStore = jest.spyOn(mockStore, "bills")

          // Simulate the upload of the file
          await waitFor(() => {
            userEvent.upload(inputFiles, testFile);
          });
      
          // Change file handler is called
          expect(handleChangeFile1).toHaveBeenCalled();
          
          // New bill is created
          expect(spyStorageGetItem).toHaveBeenCalledWith('user');
          expect(spyStore).toHaveBeenCalled();
          expect(newBill.fileName).toBe("test.jpeg")
          expect(newBill.billId).toBe("1234")
          expect(newBill.fileUrl).toBe("https://localhost:3456/images/test.jpg")
          expect(inputFiles.files[0]).toStrictEqual(testFile);
        })
      })
      describe("With extension .JPEG", () => {
        test("Then new bill is created and stored", async () => {

          // Instanciation of NewBill
          const newBill = new NewBill({ document, onNavigate: null, store: mockStore, localStorage: window.localStorage });

          // HTML input element to attach file
          const inputFiles = screen.getByTestId('file')
          // Instanciation of test File
          const testFile = new File(["(⌐□_□)"], 'test.JPEG', { type: "image/jpg" });

          const handleChangeFile1 = jest.fn((e) => newBill.handleChangeFile(e))
          inputFiles.addEventListener('change', handleChangeFile1)

          // Spy on the mocks : localStorage and store
          const spyStorageGetItem = jest.spyOn(localStorageMock, "getItem")
          const spyStore = jest.spyOn(mockStore, "bills")

          // Simulate the upload of the file
          await waitFor(() => {
            userEvent.upload(inputFiles, testFile);
          });
      
          // Change file handler is called
          expect(handleChangeFile1).toHaveBeenCalled();
          
          // New bill is created
          expect(spyStorageGetItem).toHaveBeenCalledWith('user');
          expect(spyStore).toHaveBeenCalled();
          expect(newBill.fileName).toBe("test.JPEG")
          expect(newBill.billId).toBe("1234")
          expect(newBill.fileUrl).toBe("https://localhost:3456/images/test.jpg")
          expect(inputFiles.files[0]).toStrictEqual(testFile);
        })
      })
      describe("With extension .png", () => {
        test("Then new bill is created and stored", async () => {

          // Instanciation of NewBill
          const newBill = new NewBill({ document, onNavigate: null, store: mockStore, localStorage: window.localStorage });

          // HTML input element to attach file
          const inputFiles = screen.getByTestId('file')
          // Instanciation of test File
          const testFile = new File(["(⌐□_□)"], 'test.png', { type: "image/png" });

          const handleChangeFile1 = jest.fn((e) => newBill.handleChangeFile(e))
          inputFiles.addEventListener('change', handleChangeFile1)

          // Spy on the mocks : localStorage and store
          const spyStorageGetItem = jest.spyOn(localStorageMock, "getItem")
          const spyStore = jest.spyOn(mockStore, "bills")

          // Simulate the upload of the file
          await waitFor(() => {
            userEvent.upload(inputFiles, testFile);
          });
      
          // Change file handler is called
          expect(handleChangeFile1).toHaveBeenCalled();
          
          // New bill is created
          expect(spyStorageGetItem).toHaveBeenCalledWith('user');
          expect(spyStore).toHaveBeenCalled();
          expect(newBill.fileName).toBe("test.png")
          expect(newBill.billId).toBe("1234")
          expect(newBill.fileUrl).toBe("https://localhost:3456/images/test.jpg")
          expect(inputFiles.files[0]).toStrictEqual(testFile);
        })
      })
      describe("With extension .PNG", () => {
        test("Then new bill is created and stored", async () => {

          // Instanciation of NewBill
          const newBill = new NewBill({ document, onNavigate: null, store: mockStore, localStorage: window.localStorage });

          // HTML input element to attach file
          const inputFiles = screen.getByTestId('file')
          // Instanciation of test File
          const testFile = new File(["(⌐□_□)"], 'test.PNG', { type: "image/png" });

          const handleChangeFile1 = jest.fn((e) => newBill.handleChangeFile(e))
          inputFiles.addEventListener('change', handleChangeFile1)

          // Spy on the mocks : localStorage and store
          const spyStorageGetItem = jest.spyOn(localStorageMock, "getItem")
          const spyStore = jest.spyOn(mockStore, "bills")

          // Simulate the upload of the file
          await waitFor(() => {
            userEvent.upload(inputFiles, testFile);
          });
      
          // Change file handler is called
          expect(handleChangeFile1).toHaveBeenCalled();
          
          // New bill is created
          expect(spyStorageGetItem).toHaveBeenCalledWith('user');
          expect(spyStore).toHaveBeenCalled();
          expect(newBill.fileName).toBe("test.PNG")
          expect(newBill.billId).toBe("1234")
          expect(newBill.fileUrl).toBe("https://localhost:3456/images/test.jpg")
          expect(inputFiles.files[0]).toStrictEqual(testFile);
        })
      })
    })

    describe("When I submit a new bill", () => {
      test("Then the new bill is updated with the form data and render the Bills page", async () => {

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        // Instanciation of NewBill
        const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });

        // HTML input element to attach file
        const inputFiles = screen.getByTestId('file')
        // Instanciation of test File
        const testFile = new File(["(⌐□_□)"], 'test.jpg', { type: "image/jpg" });

        // Simulate the upload of the file
        await waitFor(() => {
              userEvent.upload(inputFiles, testFile);
        });

        // Complete the form with valid data
        screen.getByTestId("expense-type").value = "Restaurants et bars"
        screen.getByTestId("expense-name").value = "Test expense name"
        screen.getByTestId("datepicker").value = "2022-01-01"
        screen.getByTestId("amount").value = "99"
        screen.getByTestId("vat").value = "70"
        screen.getByTestId("pct").value = "30"
        screen.getByTestId("commentary").value = "Test submit new Bill"

        // Spy on the mocks
        const spyStorageGetItem = jest.spyOn(localStorageMock, "getItem")
        const spyStore = jest.spyOn(mockStore, "bills")
        const spyUpdateBill = jest.spyOn(newBill, 'updateBill')

        const submitButton = screen.getByTestId('form-new-bill')
        const handleSubmitTest = jest.fn((e) => newBill.handleSubmit(e))
        submitButton.addEventListener('submit', handleSubmitTest)

        // Simulate the submit of the form
        await waitFor(() => {
              userEvent.click(screen.getByText('Envoyer'))
        });
        
        expect(handleSubmitTest).toHaveBeenCalled();
        expect(spyUpdateBill.mock.calls[0][0].type).toBe('Restaurants et bars');
        expect(spyUpdateBill.mock.calls[0][0].name).toBe("Test expense name");
        expect(spyUpdateBill.mock.calls[0][0].amount).toBe(99);
        expect(spyUpdateBill.mock.calls[0][0].date).toBe('2022-01-01');
        expect(spyUpdateBill.mock.calls[0][0].vat).toBe('70');
        expect(spyUpdateBill.mock.calls[0][0].pct).toBe(30);
        expect(spyUpdateBill.mock.calls[0][0].commentary).toBe('Test submit new Bill');
        expect(spyUpdateBill.mock.calls[0][0].fileName).toBe("test.jpg");
        expect(spyUpdateBill.mock.calls[0][0].status).toBe("pending");

        // It should render the Bills page
        await waitFor(() => screen.getByText('Mes notes de frais'))
        expect(screen.getByText('Mes notes de frais')).toBeTruthy()
      })
    })
  })
})

// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills page", () => {
    test("post a new bill with mock API POST", async () => {
      localStorage.clear()
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "e@e" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      
      await waitFor(() => screen.getByText("Envoyer une note de frais"))

      // Complete the form with valid data
      screen.getByTestId("expense-type").value = "Restaurants et bars"
      screen.getByTestId("expense-name").value = "Test expense name"
      screen.getByTestId("datepicker").value = "2022-01-01"
      screen.getByTestId("amount").value = "99"
      screen.getByTestId("vat").value = "70"
      screen.getByTestId("pct").value = "30"
      screen.getByTestId("commentary").value = "Test integration POST"

      // Upload a  file
      const input = screen.getByTestId('file')
      const fakeFile = new File(["(⌐□_□)"], 'test.png', { type: "image/png" });
      await waitFor(() => {
            userEvent.upload(input, fakeFile);
      });

      jest.spyOn(mockStore, "bills")    
      jest.spyOn(console, 'error').mockImplementation(() => { });
      console.error.mockClear();
      

      // Submit the form
      await waitFor(() => {
            userEvent.click(screen.getByText('Envoyer'))
      });

      await waitFor(() => screen.getByText("Mes notes de frais"))

      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
      const billTest1  = screen.getByText("test1")
      expect(billTest1).toBeTruthy()
      expect(mockStore.bills).toHaveBeenCalled()
      expect(console.error).not.toHaveBeenCalled();
    })

    describe("When an error occurs on API", () => {

      beforeEach(() => {
        Object.defineProperty(
            window,
            'localStorage',
            { value: localStorageMock }
        )
        window.localStorage.clear()
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

        window.onNavigate(ROUTES_PATH.NewBill)
      
        await waitFor(() => screen.getByText("Envoyer une note de frais"))

        // Complete the form with valid data
        screen.getByTestId("expense-type").value = "Restaurants et bars"
        screen.getByTestId("expense-name").value = "Test expense name"
        screen.getByTestId("datepicker").value = "2022-01-01"
        screen.getByTestId("amount").value = "99"
        screen.getByTestId("vat").value = "70"
        screen.getByTestId("pct").value = "30"
        screen.getByTestId("commentary").value = "Test integration POST"

        // Upload a  file
        const input = screen.getByTestId('file')
        const fakeFile = new File(["(⌐□_□)"], 'test.png', { type: "image/png" });
        await waitFor(() => {
              userEvent.upload(input, fakeFile);
        });

        const spyStore = jest.spyOn(mockStore, "bills")
        mockStore.bills.mockImplementationOnce(() => {
          return {
            update : (bill) =>  {
              return Promise.reject(new Error("Erreur 404"))
            }
          }
        })
        jest.spyOn(console, 'error').mockImplementation(() => { });
        console.error.mockClear();

        // Submit the form
        await waitFor(() => {
              userEvent.click(screen.getByText('Envoyer'))
        });


        await new Promise(process.nextTick);
        expect(console.error).toHaveBeenCalled();
        expect(console.error.mock.calls[0][0].message).toContain('Erreur 404');
        expect(screen.getByText("Mes notes de frais")).toBeTruthy();
        expect(screen.getByText("Mes notes de frais")).toBeTruthy();
      })

      test("fetches bills from an API and fails with 500 message error", async () => {

        window.onNavigate(ROUTES_PATH.NewBill)
      
        await waitFor(() => screen.getByText("Envoyer une note de frais"))

        // Complete the form with valid data
        screen.getByTestId("expense-type").value = "Restaurants et bars"
        screen.getByTestId("expense-name").value = "Test expense name"
        screen.getByTestId("datepicker").value = "2022-01-01"
        screen.getByTestId("amount").value = "99"
        screen.getByTestId("vat").value = "70"
        screen.getByTestId("pct").value = "30"
        screen.getByTestId("commentary").value = "Test integration POST"

        // Upload a  file
        const input = screen.getByTestId('file')
        const fakeFile = new File(["(⌐□_□)"], 'test.png', { type: "image/png" });
        await waitFor(() => {
              userEvent.upload(input, fakeFile);
        });

        const spyStore = jest.spyOn(mockStore, "bills")
        mockStore.bills.mockImplementationOnce(() => {
          return {
            update : (bill) =>  {
              return Promise.reject(new Error("Erreur 500"))
            }
          }
        })
        jest.spyOn(console, 'error').mockImplementation(() => { });
        console.error.mockClear();

        // Submit the form
        await waitFor(() => {
              userEvent.click(screen.getByText('Envoyer'))
        });


        await new Promise(process.nextTick);
        expect(console.error).toHaveBeenCalled();
        expect(console.error.mock.calls[0][0].message).toContain('Erreur 500');
        expect(screen.getByText("Mes notes de frais")).toBeTruthy();
        expect(screen.getByText("Mes notes de frais")).toBeTruthy();
      })

    })
  })
})