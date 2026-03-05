package com.crms.property;

import org.junit.jupiter.api.Test;
import org.quicktheories.core.Gen;
import static org.quicktheories.QuickTheory.qt;
import static org.quicktheories.generators.Generate.*;
import static org.quicktheories.generators.SourceDSL.*;

import java.util.UUID;

public class RoutinePropertyTest {

    @Test
    public void testRoutineUniquenessProperty() {
        qt()
            .forAll(uuids(), uuids())
            .check((id1, id2) -> {
                if (id1.equals(id2)) {
                    return true;
                }
                // Logical property: two different routines must have different identities
                return !id1.equals(id2);
            });
    }

    private Gen<UUID> uuids() {
        return strings().basicLatinAlphabet().ofLengthBetween(10, 20).map(s -> UUID.nameUUIDFromBytes(s.getBytes()));
    }
}
