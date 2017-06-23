package com.edd.repository;

import com.edd.domain.Worksheet;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the Worksheet entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorksheetRepository extends JpaRepository<Worksheet,Long> {

    @Query("select worksheet from Worksheet worksheet where worksheet.user.login = ?#{principal.username}")
    List<Worksheet> findByUserIsCurrentUser();
    
}
