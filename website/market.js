
      // Funzione per mostrare la modal con le caratteristiche del prodotto
      function showProductDetails(title,description,price,imagePath){
        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalImage').src=imagePath;
        document.getElementById('modalDescription').innerText = description;
        document.getElementById('modalPrice').innerText = price;
        
        var modal = document.getElementById('myModal');
        modal.style.display = 'block';
      }
      
      // Funzione per chiudere la finestra modal
      function closeModal() {
        var modal = document.getElementById('myModal');
        var modal2=document.getElementById('confirmModal');
        modal.style.display = 'none';
        modal2.style.display = 'none';
      }
      
      // Funzione chiamata quando viene cliccato il pulsante "Buy"
      function sureToBuy() {
        var modal = document.getElementById('confirmModal');
        modal.style.display = 'block';
        }
      // Funzione chiamata quando viene cliccato il pulsante "I want to sell"
      function sellWind(){
       
      }
      