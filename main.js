/**
 * GŁÓWNY KONTROLER INTERFEJSU (main.js)
 * Architektura: Vanilla JS (ES6+)
 * Paradygmat: Imperatywny z elementami programowania zdarzeniowego.
 */

document.addEventListener('DOMContentLoaded', () => {
    // =======================================================================
    // MODUŁ 1.5: INTERAKTYWNY CENNIK (Wybór usługi)
    // =======================================================================
    const pricingCards = document.querySelectorAll('.pricing-card');
    const formServiceSelect = document.getElementById('service'); // Referencja do dropdownu w formularzu

    pricingCards.forEach(card => {
        card.addEventListener('click', function() {
            // 1. Usuń klasę 'highlight' ze wszystkich kart
            pricingCards.forEach(c => c.classList.remove('highlight'));
            // 2. Dodaj klasę 'highlight' tylko do klikniętej
            this.classList.add('highlight');
            
            // Opcjonalnie: Zsynchronizuj wybór z dropdownem w ukrytym formularzu
            const serviceName = this.querySelector('h3').innerText;
            if(formServiceSelect) {
                Array.from(formServiceSelect.options).forEach(option => {
                    if(option.value === serviceName) option.selected = true;
                });
            }
        });
    });
    
    // =======================================================================
    // MODUŁ 1: INŻYNIERIA AKORDEONU (Sekcja Metodologii)
    // Cel: Dynamiczna manipulacja wysokością bloku (maxHeight) dla płynnych przejść.
    // =======================================================================
    
    const accordions = document.querySelectorAll('.accordion-header');

    accordions.forEach(accordion => {
        accordion.addEventListener('click', function() {
            // 1. Przełączenie stanu aktywnego na klikniętym elemencie (rotacja ikony)
            this.classList.toggle('active');

            // 2. Obsługa dostępności (WCAG) - komunikacja dla czytników ekranowych
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);

            // 3. Pobranie sąsiadującego węzła w drzewie DOM (kontener z treścią)
            const content = this.nextElementSibling;

            // 4. Logika matematyczna przejścia:
            // Jeśli element ma już przypisaną wysokość (jest otwarty), zerujemy ją.
            // W przeciwnym razie odczytujemy fizyczną wysokość jego zawartości (scrollHeight)
            // i dynamicznie rzutujemy ją jako wartość parametru CSS w pikselach.
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // =======================================================================
    // MODUŁ 2: TWARDE JĄDRO SYSTEMU - SILNIK KALENDARZA REZERWACYJNEGO
    // Cel: Generowanie matrycy czasu od zera przy użyciu natywnego obiektu Date.
    // =======================================================================

    // Pobranie referencji do kluczowych węzłów DOM
    const calendarBody = document.getElementById('calendar-body');
    const monthYearDisplay = document.getElementById('month-year-display');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    // Inicjalizacja instancji czasu dla punktu startowego pacjenta
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth(); // Zwraca wartość 0-11 (0 = Styczeń)
    let currentYear = currentDate.getFullYear();

    // Słownik referencyjny dla nazw miesięcy w języku polskim
    const monthNames = [
        "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", 
        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
    ];

    /**
     * Główny algorytm renderujący siatkę kalendarza.
     * @param {number} month - Docelowy miesiąc do wyrenderowania (0-11)
     * @param {number} year - Docelowy rok do wyrenderowania
     */
    function generateCalendar(month, year) {
        // Czyszczenie poprzedniego stanu drzewa DOM (zapobieganie wyciekom pamięci)
        calendarBody.innerHTML = "";

        // Aktualizacja nagłówka interfejsu (H3)
        monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

        // -------------------------------------------------------------------
        // [KLUCZOWY PUNKT OBRONY NA EGZAMINIE - OBLICZENIA CZASU]
        // 1. Zjawisko "Dnia Zerowego" - Pobieranie liczby dni w miesiącu
        // Konstruktor new Date(year, month, day) interpretuje dzień 0 jako
        // "ostatni dzień poprzedniego miesiąca". Podając mu miesiąc (month + 1)
        // i dzień 0, zmuszamy silnik JS do matematycznego cofnięcia się o jeden dzień,
        // co bezbłędnie zwraca długość docelowego miesiąca (radzi sobie z latami przestępnymi).
        // -------------------------------------------------------------------
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // -------------------------------------------------------------------
        // 2. Ofset startowy - Określenie, od jakiego dnia tygodnia zaczyna się miesiąc.
        // Tworzymy instancję pierwszego dnia (dzień 1) docelowego miesiąca.
        // Metoda getDay() standardowo zwraca: 0 (Niedziela), 1 (Poniedziałek) ... 6 (Sobota).
        // Ponieważ w Europie tydzień zaczyna się w Poniedziałek, przeprowadzamy 
        // inżynieryjną transformację indeksów (Ternary Operator).
        // -------------------------------------------------------------------
        let firstDayIndex = new Date(year, month, 1).getDay();
        firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1; 

        // Zmienne sterujące pętlami
        let dateCounter = 1;
        let rowCounter = 0;

        // Pętla główna: Generowanie rzędów (tygodni) w tabeli
        // Uruchamiamy dopóki nie wypiszemy wszystkich dni miesiąca (dateCounter <= daysInMonth)
        while (dateCounter <= daysInMonth) {
            // Wstrzyknięcie nowego wiersza (<tr>) bezpośrednio do obiektu drzewa
            let row = calendarBody.insertRow();
            
            // Pętla zagnieżdżona: Generowanie komórek (dni) dla 7 dni w tygodniu
            for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                
                // Wstrzyknięcie komórki (<td>) do utworzonego przed chwilą wiersza
                let cell = row.insertCell();

                // Warunek początkowy: Tworzenie pustych komórek (ofset),
                // jeśli jesteśmy w pierwszym tygodniu i nie dotarliśmy do dnia startowego.
                if (rowCounter === 0 && dayOfWeek < firstDayIndex) {
                    // Komórka zostaje pusta, CSS zadba o brak reakcji na :hover
                    continue; 
                } 
                // Warunek główny: Tworzenie komórek z faktycznymi datami
                else if (dateCounter <= daysInMonth) {
                    cell.textContent = dateCounter;
                    
                    // Asygnacja atrybutów danych dla wyłapywania kliknięć do systemu rezerwacji
                    // Formatowanie daty pod standard ISO z wymuszeniem dwóch cyfr (np. 05)
                    const formattedMonth = String(month + 1).padStart(2, '0');
                    const formattedDate = String(dateCounter).padStart(2, '0');
                    cell.setAttribute('data-date', `${year}-${formattedMonth}-${formattedDate}`);

                    // Identyfikacja i podświetlenie dzisiejszej daty w czasie rzeczywistym
                    let today = new Date();
                    if (dateCounter === today.getDate() && 
                        year === today.getFullYear() && 
                        month === today.getMonth()) {
                        
                        // Dodanie specyficznej klasy, którą można ostylować w CSS
                        cell.classList.add('current-day');
                        cell.style.backgroundColor = 'var(--color-primary)';
                        cell.style.color = 'var(--color-white)';
                        cell.style.fontWeight = 'bold';
                    }

                    // Implementacja nasłuchiwania na interakcję z konkretnym dniem
                    cell.addEventListener('click', function() {
                        // Implementacja nasłuchiwania na interakcję z konkretnym dniem
                    cell.addEventListener('click', function() {
                        const selectedDate = this.getAttribute('data-date');
                        
                        // INŻYNIERIA WYBORU DATY (Zmiana koloru)
                        // 1. Odszukaj wszystkie komórki i zdejmij z nich klasę aktywnego wyboru
                        document.querySelectorAll('.calendar-table td').forEach(td => {
                            td.classList.remove('selected-day');
                        });
                        // 2. Nadaj nową klasę ubarwiającą (Terakota) klikniętej komórce
                        this.classList.add('selected-day');

                        // INŻYNIERIA FORMULARZA (Otwieranie Modala)
                        const modal = document.getElementById('booking-modal');
                        const dateDisplay = document.getElementById('selected-date-display');
                        const hiddenInput = document.getElementById('hidden-date-input');

                        // Wstrzyknięcie wybranej daty do widoku (H2) i do ukrytego pola (dla e-maila)
                        dateDisplay.textContent = selectedDate;
                        hiddenInput.value = selectedDate;

                        // Aktywacja modala
                        modal.classList.add('active');
                        modal.setAttribute('aria-hidden', 'false');
                    });
                    });

                    dateCounter++;
                }
            }
            rowCounter++;
        }
    }

    // =======================================================================
    // NASŁUCHIWACZE ZDARZEŃ (Event Listeners) DLA NAWIGACJI KALENDARZA
    // =======================================================================
    
    prevMonthBtn.addEventListener('click', () => {
        // Dekrementacja miesiąca. Jeśli spadnie poniżej zera (Styczeń), 
        // przełączamy na Grudzień (11) i cofamy rok.
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener('click', () => {
        // Inkrementacja miesiąca. Jeśli przekroczy 11 (Grudzień),
        // przełączamy na Styczeń (0) i podbijamy rok.
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });

    // Uruchomienie kompilatora po raz pierwszy po załadowaniu drzewa DOM
    generateCalendar(currentMonth, currentYear);
    // =======================================================================
    // OBSŁUGA ZAMYKANIA FORMULARZA REZERWACJI (Modal)
    // =======================================================================
    const modal = document.getElementById('booking-modal');
    const closeModalBtn = document.getElementById('close-modal');

    // Zamknięcie przez "X"
    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        });
    }

    // Zamknięcie przez kliknięcie w przyciemnione tło
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        }
        // =======================================================================
    // MODUŁ 3: ASYNCHRONICZNA WYSYŁKA FORMULARZA (AJAX / Fetch API)
    // =======================================================================
    const bookingForm = document.getElementById('booking-form');
    const formFields = document.getElementById('form-fields');
    const successMessage = document.getElementById('success-message');
    const submitBtn = document.getElementById('submit-btn');

    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            // BEZWZGLĘDNY NAKAZ: Zablokowanie domyślnego przekierowania przeglądarki
            e.preventDefault(); 

            // UX: Zmiana stanu przycisku, by uniknąć podwójnego kliknięcia
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Przetwarzanie...";
            submitBtn.disabled = true;

            // Serializacja danych z formularza
            const formData = new FormData(this);

            try {
                // Asynchroniczne odpytanie serwera Formspree
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // SUKCES: Ukrywamy wektory wejściowe, eksponujemy komunikat
                    formFields.style.display = 'none';
                    successMessage.style.display = 'block';
                    this.reset(); // Czyszczenie bufora wpisanych danych
                } else {
                    alert("Wystąpił błąd komunikacji. Serwer odrzucił żądanie.");
                }
            } catch (error) {
                alert("Błąd krytyczny sieci. Sprawdź połączenie.");
            } finally {
                // Przywrócenie pierwotnego stanu przycisku
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // =======================================================================
    // ZAAWANSOWANA OBSŁUGA ZAMYKANIA I RESETOWANIA MODALA
    // =======================================================================
    const closeModalBtn = document.getElementById('close-modal');

    // Funkcja przywracająca formularz do stanu początkowego
    function resetModalState() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        
        // Z drobnym opóźnieniem (po zakończeniu animacji CSS) resetujemy widok 
        setTimeout(() => {
            if(formFields && successMessage) {
                formFields.style.display = 'block';
                successMessage.style.display = 'none';
            }
        }, 300);
    }

    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', resetModalState);
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            resetModalState();
        }
    });
    });
    
}
);

